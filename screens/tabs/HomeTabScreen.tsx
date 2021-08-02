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
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { 
    Media, 
    MediaList, 
    User, 
    Page, 
} from '../../model/anilist';
import { StoreState, anilistSlice } from '../../store/store';

const url = 'https://graphql.anilist.co';
const authUrl = `https://anilist.co/api/v2/oauth/authorize`;

const clientId: string = Constants.manifest?.extra?.anilistClientId;

export default function HomeTabScreen() {
    const dispatch = useDispatch();
    const state = useSelector((state: StoreState) => state);
    // filter the items that are still airing
    const animeAiring = useSelector((state: StoreState) => {
        // clone the list
        const list = [...state.anilist.animeInProgress];
        
        return list.filter(m => m.media.status === 'RELEASING')
    });
    // filter the items that finished airing
    const animeFinishedAiring = useSelector((state: StoreState) => {
        // clone the list
        const list = [...state.anilist.animeInProgress];
        
        return list.filter(m => m.media.status === 'FINISHED');
    });

    const RenderItem: ListRenderItem<MediaList> = ({ item, index }) => {
        // check if this is the last item on the list
        const isLast = index === (state.anilist.animeInProgress.length - 1);
        const isFirst = index === 0;
        
        return (
            <ItemCard 
                title={item.media.title.romaji} 
                coverImage={item.media.coverImage.medium}
                progress={item.progress}
                episodes={item.media.episodes}
                isLast={isLast}
                isFirst={isFirst}
            />
        );
    };

    const handleLogInBtnPress = () => {
        Linking.openURL(authUrl + '?client_id=' + clientId + '&response_type=token');
    };

    return (
        <View style={styles.container}>
            {(state.anilist.token == null) ? (
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
                                renderItem={RenderItem}
                                keyExtractor={item => item.media.id.toString()}
                                horizontal={true}
                            />
                    </View>

                    <Text style={[styles.text, { margin: 15, color: 'rgb(159,173,189)', }]}>
                        Anime in Progress
                    </Text>
                    <View style={styles.cardListWrapper}>
                            <FlatList
                                data={animeFinishedAiring}
                                renderItem={RenderItem}
                                keyExtractor={item => item.media.id.toString()}
                                horizontal={true}
                            />
                    </View>
                </>
            )}

            <Text style={{ color: 'white', marginTop: 20 }}>
                {state.anilist.user == null ? 'Nada' : state.anilist.user.name}
            </Text>

            <StatusBar style="light" />
        </View>
    );
};

function ItemCard({ title, isLast, isFirst, coverImage, progress, episodes }: any) {
    return (
        <View 
            style={[styles.itemCard, { 
                marginRight: (isLast) ? 10 : 25,
                marginLeft: (isFirst) ? 10 : 0,
            }]}
        >
            <Image 
                style={styles.cardCoverImage} 
                source={{ uri: coverImage }} 
            />

            <View style={styles.cardContent}>
                <Text 
                    style={[styles.cardContentText, styles.cardContentTitle]}
                    numberOfLines={1}
                >
                    {title}
                </Text>
            
                <View style={styles.cardContentInfo}>
                    <Text style={[styles.cardContentText, styles.cardContentInfoText]}>
                        Progress: {progress}/{episodes} +
                    </Text>
                </View>
            </View>
        </View>
    );
};

function sortMediaList(list: MediaList[]): MediaList[] {
    let listCopy = [...list];
    return listCopy.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());
}

const backgroundColor = '#0B1622';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
        alignItems: 'flex-start',
        //justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
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
    itemCard: {
        backgroundColor: '#151F2E',
        height: 115,
        width: 255,
        borderRadius: 3,
        flexDirection: 'row',
    },
    cardCoverImage: {
        height: 115,
        width: 85,
    },
    cardContent: {
        flex: 1,
        padding: 12,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    cardContentText: {
        color: 'rgb(159,173,189)',
    },
    cardContentTitle: {
        fontSize: 16,
    },
    cardContentInfo: {
        marginBottom: 1,
    },
    cardContentInfoText: {
        fontSize: 14,
    },
});