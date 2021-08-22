import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, FlatList, SectionList,  } from 'react-native';
import { ActivityIndicator, Button, Colors, List } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MediaListStatus, MediaType, MediaList, User, Media } from '../../model/anilist';
import { StoreState, anilistSlice } from '../../store/store';
import { fetchMediaList } from '../../api/anilist';
import { useEffect } from 'react';

interface Section {
    title: string,
    data: MediaList[],
};

export default function AnimeTabScreen(): JSX.Element {
    const anilist = useSelector((state: StoreState) => state.anilist); 
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasFetchedInitialData, setHasFetchedInitialData] = useState<boolean>(false);
    const [current, setCurrent] = useState<MediaList[]>([]);
    const [repeating, setRepeating] = useState<MediaList[]>([]);
    const [completed, setCompleted] = useState<MediaList[]>([]);
    const [sections, setSections] = useState<Section[]>([]);
    
    const fetchInitialData = (token: string, user: User) => {
        fetchMediaList(token, user.id, MediaType.ANIME, MediaListStatus.CURRENT)
            .then((currentAnime) => {
                setIsLoading(false);
                setCurrent(currentAnime);
            }) 
            .catch((err) => console.error(err));
        
        fetchMediaList(token, user.id, MediaType.ANIME, MediaListStatus.REPEATING)
            .then((repeatingAnime) => {
                setIsLoading(false);
                setRepeating(repeatingAnime);
            })
            .catch((err) => console.error(err));
        
        fetchMediaList(token, user.id, MediaType.ANIME, MediaListStatus.COMPLETED)
            .then((completedAnime) => {
                setIsLoading(false);
                setCompleted(completedAnime);
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
        setSections([
            {
                title: 'Watching',
                data: [...current],
            },
            {
                title: 'Rewatching',
                data: [...repeating],
            },
            {
                title: 'Completed',
                data: [...completed],
            },
        ]);
    }, [current, repeating, completed]);

    return (
        <View style={styles.container}>
            <SectionList 
                sections={sections}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <Text key={index}>{item.media.title.romaji}</Text>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
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
        color: 'rgb(159,173,189)'
    },
});
