import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, SectionList } from 'react-native';
import { ActivityIndicator, Button, Colors, Divider } from 'react-native-paper';
import { Text, FAB } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { t } from "@lingui/macro";
import {
    MediaListStatus, 
    MediaType, 
    MediaList, 
    User, 
    MediaListSort,
} from '../model/anilist';
import { StoreState, anilistSlice } from '../store/store';
import { fetchMediaList } from '../api/anilist';
import MediaListCard from '../components/MediaListCard';

interface MediaListScreenProps {
    mediaType: MediaType,
}

interface Section {
    title: string,
    data: MediaList[],
};

enum SectionIndex {
    CURRENT   = 0,
    REPEATING = 1,
    COMPLETED = 2,
    PAUSED    = 3,
    DROPPED   = 4,
    PLANNING  = 5,
}

interface LastDownloaded {
    section: SectionIndex,
    page: number,
    hasNextPage: boolean,
}

const INITIAL_SECTIONS = [
    {
        title: t`watching.label`,
        data: [],
    },
    {
        title: t`rewatching.label`,
        data: [],
    },
    {
        title: t`completed.label`,
        data: [],
    },
    {
        title: t`paused.label`,
        data: [],
    },
    {
        title: t`dropped.label`,
        data: [],
    },
    {
        title: t`planning.label`,
        data: [],
    },
];

export default function AnimeTabScreen({ mediaType}: MediaListScreenProps): JSX.Element {
    const navigation = useNavigation();
    const anilist = useSelector((state: StoreState) => state.anilist); 
    const dispatch = useDispatch();
    
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isListComplete, setIsListComplete] = useState<boolean>(false);
    const [hasFetchedInitialData, setHasFetchedInitialData] = useState<boolean>(false);
    const [lastDownloaded, setLastDownloaded] = useState<LastDownloaded | null>(null);
    const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);

    const getSectionData = (index: SectionIndex): MediaList[] => {
        return sections[index].data;
    };

    const addToSections = (newListItems: MediaList[], index: SectionIndex): Section[] => {
        let current   = getSectionData(SectionIndex.CURRENT);
        let repeating = getSectionData(SectionIndex.REPEATING);
        let completed = getSectionData(SectionIndex.COMPLETED);
        let paused    = getSectionData(SectionIndex.PAUSED);
        let dropped   = getSectionData(SectionIndex.DROPPED);
        let planning  = getSectionData(SectionIndex.PLANNING);

        switch (index) {
            case SectionIndex.CURRENT:
                current = [...current, ...newListItems];
                break;
            
            case SectionIndex.REPEATING:
                repeating = [...repeating, ...newListItems];
                break;

            case SectionIndex.COMPLETED:
                completed = [...completed, ...newListItems];
                break;

            case SectionIndex.PAUSED:
                paused = [...paused, ...newListItems];
                break;
            
            case SectionIndex.DROPPED:
                dropped = [...dropped, ...newListItems];
                break;
            
            case SectionIndex.PLANNING:
                planning = [...planning, ...newListItems];
                break;
        }

        const currentTitle   = (mediaType === MediaType.ANIME) ? t`watching.label`   : t`reading.label`;
        const repeatingTitle = (mediaType === MediaType.ANIME) ? t`rewatching.label` : t`rereading.label`;

        return [
            {
                title: currentTitle,
                data: current,
            },
            {
                title: repeatingTitle,
                data: repeating,
            },
            {
                title: t`completed.label`,
                data: completed,
            },
            {
                title: t`paused.label`,
                data: paused,
            },
            {
                title: t`dropped.label`,
                data: dropped,
            },
            {
                title: t`planning.label`,
                data: planning,
            },
        ];
    };
    
    const fetchInitialData = async (token: string, user: User): Promise<void> => {
        setIsLoading(true);
        const page = await fetchMediaList(
            token, 
            user.id, 
            mediaType, 
            MediaListStatus.CURRENT, 
            MediaListSort.MEDIA_TITLE_ROMAJI, 
            1
        );
        setSections((sections) => {
            const newMediaList = page.mediaList ?? [];
            return addToSections(newMediaList, SectionIndex.CURRENT);
        });
        setIsLoading(false);

        setLastDownloaded({
            section: SectionIndex.CURRENT,
            hasNextPage: page.pageInfo.hasNextPage,
            page: page.pageInfo.currentPage,
        });
    };

    const handleEndReached = async (): Promise<void> => {
        if (isLoading || !hasFetchedInitialData || isListComplete) {
            return;
        } 
        const { token, user } = anilist;
        if (lastDownloaded == null || token == null || user == null) {
            return;
        }

        // download more stuff
        let nextSection: SectionIndex | null = null;
        let pageNumber = null;
        if (lastDownloaded.hasNextPage) {
            // this section still has more pages, let's continue on the same section
            nextSection = lastDownloaded.section;
            pageNumber = lastDownloaded.page + 1;
        } else {
            if (lastDownloaded.section === SectionIndex.PLANNING) {
                // yay, we've finished downloading all sections
                setIsListComplete(true);
                return;
            } else {
                // this section doesn't have more pages, go to the next one
                nextSection = lastDownloaded.section + 1;
                pageNumber = 1;
            }
        }

        try {
            setIsLoading(true);
            const status = sectionIndexToMediaListStatus(nextSection);
            const page = await fetchMediaList(
                token, 
                user.id, 
                mediaType, 
                status, 
                MediaListSort.MEDIA_TITLE_ROMAJI, 
                pageNumber,
            );
            
            const newMediaList = page.mediaList ?? [];
            setSections((sections) => {
                if (nextSection === null) {
                    return sections;
                }
                
                return addToSections(newMediaList, nextSection);
            });
            setIsLoading(false);
            
            setLastDownloaded({
                section: nextSection,
                hasNextPage: page.pageInfo.hasNextPage,
                page: page.pageInfo.currentPage,
            });

        } catch (err: any) {
            console.error(err.message ?? err.toString());
        }
    }

    const handleRefresh = async () => {
        if (anilist.token == null || anilist.user == null) {
            return;
        }
        
        setRefreshing(true);
        setLastDownloaded(null);
        setHasFetchedInitialData(false);
        setIsLoading(false);
        setIsListComplete(false);
        setSections(INITIAL_SECTIONS);
    };

    const openSearchScreen = () => {
        // @ts-ignore
        navigation.navigate('Search');
    }

    useEffect(() => {
        if (anilist.token == null || anilist.user == null) {
            return;
        }

        if (!hasFetchedInitialData) {
            setHasFetchedInitialData(true);
            fetchInitialData(anilist.token, anilist.user)
                .then(() => setRefreshing(false))
                .catch((err: any) => {
                    setRefreshing(false);
                    console.error(err.message ?? err.toString());
                });
        }
    });

    useEffect(() => {
        if (!hasFetchedInitialData || isLoading || isListComplete) {
            return;
        }

        let totalItems = 0;
        for (const section of sections) {
            totalItems += section.data.length;
        }
        if (totalItems < 25) {
            // onEndReached is only called if the list can be scrolled, so it needs enough items 
            // let's download more stuff to make the infinite scrolling work
            handleEndReached();
        }
    }, [lastDownloaded]);

    useEffect(() => {
        // update the screen if something has changed
        if (anilist?.shouldMediaListScreenUpdate) {
            dispatch(anilistSlice.actions.setShouldMediaListScreenUpdate(false));
            handleRefresh();
        }
    });

    if (!hasFetchedInitialData) {
        if (refreshing) {
            return <View></View>;
        }
        
        return (
            <View style={styles.activityIndicatorContainer}>
                <ActivityIndicator size={50} animating={true} color={Colors.white} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SectionList 
                style={styles.listContainer}
                sections={sections}
                keyExtractor={(item) => item.id.toString()}
                onEndReachedThreshold={0.5}
                onEndReached={handleEndReached}
                renderItem={({ item }) => (
                    <MediaListCard key={item.id} item={item}/>
                )}
                renderSectionHeader={({ section: { title, data } }) => {
                    if (data.length > 0) {
                        return <Text style={styles.sectionHeader}>{title}</Text>;
                    } else {
                        return <View></View>;
                    }
                }}
                ListFooterComponent={() => {
                    if (isLoading && !refreshing) {
                        return (
                            <View style={styles.listActivityIndicatorContainer}>
                                <ActivityIndicator 
                                    size={50} 
                                    animating={true} 
                                    color={Colors.white} 
                                />
                            </View>
                        ) 
                    } else {
                        return (
                            <View></View>
                        )
                    }
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
            />

            <FAB 
                icon="magnify"
                style={styles.fab}
                onPress={openSearchScreen}
            />

            <StatusBar style="light" />
        </View>
    );
}

const backgroundColor = '#0B1622';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
        alignItems: 'stretch',
        paddingTop: Constants.statusBarHeight,
    },
    listContainer: {
        marginRight: 12,
        marginLeft: 12,
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
    activityIndicatorContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    listActivityIndicatorContainer: {
        alignItems: 'center',
    },
    accordion: {
        backgroundColor: '#151F2E',
    },
    sectionHeader: {
        fontSize: 23,
        fontFamily: 'Roboto',
        color: 'rgb(159,173,189)',
        marginBottom: 4,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#174a97',
    },
});

function mediaListStatusToSectionIndex(status: MediaListStatus): SectionIndex {
    switch (status) {
        case MediaListStatus.CURRENT:
            return SectionIndex.CURRENT;

        case MediaListStatus.REPEATING:
            return SectionIndex.REPEATING;
        
        case MediaListStatus.COMPLETED:
            return SectionIndex.COMPLETED;
        
        case MediaListStatus.PAUSED:
            return SectionIndex.PAUSED;
        
        case MediaListStatus.DROPPED:
            return SectionIndex.DROPPED;

        case MediaListStatus.PLANNING:
            return SectionIndex.PLANNING;
    }
}

function sectionIndexToMediaListStatus(status: SectionIndex): MediaListStatus {
    switch (status) {
        case SectionIndex.CURRENT:
            return MediaListStatus.CURRENT;

        case SectionIndex.REPEATING:
            return MediaListStatus.REPEATING;
        
        case SectionIndex.COMPLETED:
            return MediaListStatus.COMPLETED;
        
        case SectionIndex.PAUSED:
            return MediaListStatus.PAUSED;
        
        case SectionIndex.DROPPED:
            return MediaListStatus.DROPPED;

        case SectionIndex.PLANNING:
            return MediaListStatus.PLANNING;
    }
}