import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { FC, useEffect, useState } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { useSelector, useDispatch } from 'react-redux';
import { 
    StyleSheet, 
    View, 
    FlatList, 
    ListRenderItem, 
    Image,
    Platform,
    ScrollView,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { ActivityType, ActivityUnion, ListActivity, MediaList, MediaStatus, MessageActivity, TextActivity } from '../../model/anilist';
import { StoreState, anilistSlice } from '../../store/store';
import MediaListItemCard from '../../components/MediaListItemCard';
import TextActivityCard from '../../components/TextActivityCard';
import ListActivityCard from '../../components/ListActivityCard';

const url = 'https://graphql.anilist.co';
const authUrl = `https://anilist.co/api/v2/oauth/authorize`;

const clientId: string = Constants.manifest?.extra?.anilistClientId;

export default function HomeTabScreen() {
    const dispatch = useDispatch();
    const anilist = useSelector((state: StoreState) => state.anilist);
    // filter the items that are still airing
    const animeAiring = useSelector((state: StoreState) => {
        const { animeInProgress } = state.anilist;
        return animeInProgress.filter(m => m.media.status === MediaStatus.RELEASING);
    });
    // filter the items that finished airing
    const animeFinishedAiring = useSelector((state: StoreState) => {
        const { animeInProgress } = state.anilist;
        return animeInProgress.filter(m => m.media.status === MediaStatus.FINISHED);
    });
    const mangaInProgress = useSelector((state: StoreState) => state.anilist.mangaInProgress);
    const activities = useSelector((state: StoreState) => state.anilist.activities);

    const handleLogInBtnPress = () => {
        Linking.openURL(authUrl + '?client_id=' + clientId + '&response_type=token');
    };

    const renderItem: ListRenderItem<MediaList> = ({ item, index }) => {
        // check if this is the last item on the list
        const isLast = index === (anilist.animeInProgress.length - 1);
        const isFirst = index === 0;
        
        return (
            <MediaListItemCard 
                mediaListItem={item} 
                isLast={isLast}
                isFirst={isFirst}
            />
        );
    }

    const getActivityCard = (activity: ActivityUnion) => {
        if (
            activity.type === ActivityType.ANIME_LIST ||
            activity.type === ActivityType.MANGA_LIST ||
            activity.type === ActivityType.MEDIA_LIST
        ) {
            return ListActivityCard;
        }  else {
            return TextActivityCard;
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
                {(anilist.token == null) ? (
                    <Button 
                        mode="contained"
                        onPress={handleLogInBtnPress}
                    >
                        Log in
                    </Button>
                ) : (
                    <>
                        <Text style={[styles.text, { margin: 15, color: 'rgb(159,173,189)', }]}>
                            Airing
                        </Text>
                        <View style={styles.cardListWrapper}>
                                <FlatList
                                    data={animeAiring}
                                    keyExtractor={item => item.media.id.toString()}
                                    horizontal={true}
                                    renderItem={renderItem}
                                />
                        </View>

                        <Text style={[styles.text, { margin: 15, color: 'rgb(159,173,189)', }]}>
                            Anime in Progress
                        </Text>
                        <View style={styles.cardListWrapper}>
                                <FlatList
                                    data={animeFinishedAiring}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.media.id.toString()}
                                    horizontal={true}
                                />
                        </View>

                        <Text style={[styles.text, { margin: 15, color: 'rgb(159,173,189)', }]}>
                            Manga in Progress
                        </Text>
                        <View style={styles.cardListWrapper}>
                                <FlatList
                                    data={mangaInProgress}
                                    renderItem={renderItem}
                                    keyExtractor={item => item.media.id.toString()}
                                    horizontal={true}
                                />
                        </View>

                        <Text style={[styles.text, { margin: 15, color: 'rgb(159,173,189)', }]}>
                            Activity
                        </Text>

                        <View style={styles.activities}>
                            {activities.map((activity, index) => {
                                const ActivityCard = getActivityCard(activity);
                                return (
                                    <ActivityCard 
                                    activity={activity as any} 
                                    key={index} 
                                    />
                                );
                            })}                    
                        </View>
                    </>
                )}

                <StatusBar style="light" />
        </ScrollView>
    );
};

const backgroundColor = '#0B1622';

const styles = StyleSheet.create({
    container: {
        flexGrow: 1, // scroll doesn't work if you remove this
        backgroundColor: backgroundColor,
        //alignItems: 'flex-start',
        paddingTop: Constants.statusBarHeight,
    },
    activities: {
        display: 'flex',
        alignItems: 'stretch',
        marginRight: 15,
        marginLeft: 15,
    },
    text: {
        color: 'white',
        fontSize: 20,
        fontFamily: 'Roboto',
    },
    cardListWrapper: { 
        height: (Platform.OS === 'web') ? 135 : 115,
        width: '100%', 
        marginRight: 10, 
    },
});