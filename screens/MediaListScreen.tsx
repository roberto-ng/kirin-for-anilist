import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, RefreshControl, SectionList,  } from 'react-native';
import { ActivityIndicator, Button, Colors, Divider } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MediaListStatus, MediaType, MediaList, User, Media } from '../model/anilist';
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
    section: MediaListStatus | null,
    page: number,
    hasNextPage: boolean,
}

const INITIAL_SECTIONS = [
    {
        title: 'Watching',
        data: [],
    },
    {
        title: 'Rewatching',
        data: [],
    },
    {
        title: 'Completed',
        data: [],
    },
    {
        title: 'Paused',
        data: [],
    },
    {
        title: 'Dropped',
        data: [],
    },
    {
        title: 'Planning',
        data: [],
    },
];

export default function AnimeTabScreen({ mediaType}: MediaListScreenProps): JSX.Element {
    const anilist = useSelector((state: StoreState) => state.anilist); 
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isListComplete, setIsListComplete] = useState<boolean>(false);
    const [hasFetchedInitialData, setHasFetchedInitialData] = useState<boolean>(false);
    const [newCurrent, setNewCurrent] = useState<MediaList[]>([]);
    const [newRepeating, setNewRepeating] = useState<MediaList[]>([]);
    const [newCompleted, setNewCompleted] = useState<MediaList[]>([]);
    const [newPaused, setNewPaused] = useState<MediaList[]>([]);
    const [newDropped, setNewDropped] = useState<MediaList[]>([]);
    const [newPlanning, setNewPlanning] = useState<MediaList[]>([]);
    const [lastDownloaded, setLastDownloaded] = useState<LastDownloaded>({
        section: null,
        page: 1,
        hasNextPage: false,
    });
    const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS);

    const getSectionData = (index: SectionIndex): MediaList[] => {
        return sections[index].data;
    };

    const addToSections = (sections: Section[], newListItems: MediaList[], index: SectionIndex): Section[] => {
        let current = [...getSectionData(SectionIndex.CURRENT)];
        let repeating = [...getSectionData(SectionIndex.REPEATING)];
        let completed = [...getSectionData(SectionIndex.COMPLETED)];
        let paused = [...getSectionData(SectionIndex.PAUSED)];
        let dropped = [...getSectionData(SectionIndex.DROPPED)];
        let planning = [...getSectionData(SectionIndex.PLANNING)];

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

        const currentTitle = (mediaType === MediaType.ANIME) ? 'Watching' : 'Reading';
        const repeatingTitle = (mediaType === MediaType.ANIME) ? 'Rewatching' : 'Rereading';

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
                title: 'Completed',
                data: completed,
            },
            {
                title: 'Paused',
                data: paused,
            },
            {
                title: 'Dropped',
                data: dropped,
            },
            {
                title: 'Planning',
                data: planning,
            },
        ];
    };
    
    const fetchInitialData = async (token: string, user: User): Promise<void> => {
        setIsLoading(true);
        const page = await fetchMediaList(token, user.id, mediaType, MediaListStatus.CURRENT, 1);
        setIsLoading(false);
        setNewCurrent(page.mediaList ?? []);
        setLastDownloaded({
            section: MediaListStatus.CURRENT,
            hasNextPage: page.pageInfo.hasNextPage,
            page: page.pageInfo.currentPage,
        });
    };

    const handleEndReached = async (): Promise<void> => {
        if (isLoading || !hasFetchedInitialData || isListComplete) {
            return;
        } 
        const { token, user } = anilist;
        if (lastDownloaded.section == null || token == null || user == null) {
            return;
        }

        // download more stuff
        let nextSection = null;
        let pageNumber = null;
        if (lastDownloaded.hasNextPage) {
            // this section still has more pages, let's continue on the same section
            nextSection = lastDownloaded.section;
            pageNumber = lastDownloaded.page + 1;
        } else {
            // this section doesn't have more pages, go to the next one
            pageNumber = 1;
            switch (lastDownloaded.section) {
                case MediaListStatus.CURRENT:
                    nextSection = MediaListStatus.REPEATING;
                    break;
    
                case MediaListStatus.REPEATING:
                    nextSection = MediaListStatus.COMPLETED;
                    break;
                
                case MediaListStatus.COMPLETED:
                    nextSection = MediaListStatus.PAUSED;
                    break;
                
                case MediaListStatus.PAUSED:
                    nextSection = MediaListStatus.DROPPED;
                    break;
                
                case MediaListStatus.DROPPED:
                    nextSection = MediaListStatus.PLANNING;
                    break;

                default:
                    // yay, we've finished downloading all sections
                    setIsListComplete(true);
                    return;
            }
        }

        try {
            setIsLoading(true);
            const page = await fetchMediaList(token, user.id, mediaType, nextSection, pageNumber);
            setIsLoading(false);

            const mediaList = page.mediaList ?? [];
            switch (nextSection) {
                case MediaListStatus.CURRENT:
                    setNewCurrent(mediaList);
                    break;

                case MediaListStatus.REPEATING:
                    setNewRepeating(mediaList);
                    break;
                
                case MediaListStatus.COMPLETED:
                    setNewCompleted(mediaList);
                    break;

                case MediaListStatus.PAUSED:
                    setNewPaused(mediaList);
                    break;
                
                case MediaListStatus.DROPPED:
                    setNewDropped(mediaList);
                    break;

                case MediaListStatus.PLANNING:
                    setNewPlanning(mediaList);
                    break;
                
                default:
                    return;
            }

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
        setLastDownloaded({
            section: null,
            page: 1,
            hasNextPage: false,
        });
        setHasFetchedInitialData(false);
        setIsLoading(false);
        setIsListComplete(false);
        setSections(INITIAL_SECTIONS);
    };

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
        if (newCurrent.length === 0) {
            return;
        }
        
        setSections((sections) => addToSections(sections, newCurrent, SectionIndex.CURRENT));
        setNewCurrent(() => []);
    }, [newCurrent]);
    
    useEffect(() => {
        if (newRepeating.length === 0) {
            return;
        }

        setSections((sections) => addToSections(sections, newRepeating, SectionIndex.REPEATING));
        setNewRepeating(() => []);
    }, [newRepeating]);

    useEffect(() => {
        if (newCompleted.length === 0) {
            return;
        }

        setSections((sections) => addToSections(sections, newCompleted, SectionIndex.COMPLETED));
        setNewCompleted(() => []);
    }, [newCompleted]);

    useEffect(() => {
        if (newPaused.length === 0) {
            return;
        }

        setSections((sections) => addToSections(sections, newPaused, SectionIndex.PAUSED));
        setNewPaused(() => []);
    }, [newPaused]);

    useEffect(() => {
        if (newDropped.length === 0) {
            return;
        }

        setSections((sections) => addToSections(sections, newDropped, SectionIndex.DROPPED));
        setNewDropped(() => []);
    }, [newDropped]);

    useEffect(() => {
        if (newPlanning.length === 0) {
            return;
        }

        setSections((sections) => addToSections(sections, newPlanning, SectionIndex.PLANNING));
        setNewPlanning(() => []);
    }, [newPlanning]);

    if (!hasFetchedInitialData) {
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
                onEndReachedThreshold={5}
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
                ListFooterComponent={() => (
                    (isLoading) ? (
                        <View style={styles.listActivityIndicatorContainer}>
                            <ActivityIndicator size={50} animating={true} color={Colors.white} />
                        </View>
                    ) : (
                        <View></View>
                    )
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                    />
                }
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
});
