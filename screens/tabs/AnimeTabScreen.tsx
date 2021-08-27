import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, SectionList,  } from 'react-native';
import { ActivityIndicator, Button, Colors, Divider } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MediaListStatus, MediaType, MediaList, User, Media } from '../../model/anilist';
import { StoreState, anilistSlice } from '../../store/store';
import { fetchMediaList } from '../../api/anilist';
import MediaListCard from '../../components/MediaListCard';

interface Section {
    title: string,
    data: MediaList[],
};

enum SectionIndex {
    CURRENT = 0,
    REPEATING = 1,
    COMPLETED = 2,
}

export default function AnimeTabScreen(): JSX.Element {
    const anilist = useSelector((state: StoreState) => state.anilist); 
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasFetchedInitialData, setHasFetchedInitialData] = useState<boolean>(false);
    const [newCurrent, setNewCurrent] = useState<MediaList[]>([]);
    const [newRepeating, setNewRepeating] = useState<MediaList[]>([]);
    const [newCompleted, setNewCompleted] = useState<MediaList[]>([]);
    const [sections, setSections] = useState<Section[]>([
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
    ]);

    const getSectionData = (index: SectionIndex): MediaList[] => {
        return sections[index].data;
    };

    const addToSections = (sections: Section[], newListItems: MediaList[], index: SectionIndex): Section[] => {
        let current = [...getSectionData(SectionIndex.CURRENT)];
        let repeating = [...getSectionData(SectionIndex.REPEATING)];
        let completed = [...getSectionData(SectionIndex.COMPLETED)];

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
        }

        return [
            {
                title: 'Watching',
                data: current,
            },
            {
                title: 'Rewatching',
                data: repeating,
            },
            {
                title: 'Completed',
                data: completed,
            },
        ];
    };
    
    const fetchInitialData = (token: string, user: User): void => {
        fetchMediaList(token, user.id, MediaType.ANIME, MediaListStatus.CURRENT)
            .then((currentAnime) => {
                setIsLoading(false);
                setNewCurrent(currentAnime);
            }) 
            .catch((err) => console.error(err));
        
        fetchMediaList(token, user.id, MediaType.ANIME, MediaListStatus.REPEATING)
            .then((repeatingAnime) => {
                setIsLoading(false);
                setNewRepeating(repeatingAnime);
            })
            .catch((err) => console.error(err));
        
        fetchMediaList(token, user.id, MediaType.ANIME, MediaListStatus.COMPLETED)
            .then((completedAnime) => {
                setIsLoading(false);
                setNewCompleted(completedAnime);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        if (anilist.token == null || anilist.user == null) {
            return;
        }

        if (!hasFetchedInitialData) {
            setHasFetchedInitialData(true);
            fetchInitialData(anilist.token, anilist.user);
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
            />

            {(isLoading) && (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator size={50} animating={true} color={Colors.white} />
                </View>
            )}

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
        //justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
    },
    listContainer: {
        //width: '100%',
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
