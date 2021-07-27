import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { FC, useEffect, useState } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as QueryString from 'query-string';
import { 
    StyleSheet, 
    View, 
    FlatList, 
    ListRenderItem, 
    Image,
    Platform,
} from 'react-native';
import { Button, Text } from 'react-native-paper';

interface Media {
    id: string,
    episodes: number,
    title: {
        romaji: string,
        english: string,
        native: string,
    },
    coverImage: {
        medium: string,
    },
}

interface MediaList {
    progress: number,
    media: Media,
}

interface User {
    id: string,
    name: string,
}

interface Page {
    mediaList: MediaList[],
    pageInfo: {
        currentPage: number,
        hasNextPage: boolean,
        lastPage: number,
        perPage: number,
        total: number,
    },
}

WebBrowser.maybeCompleteAuthSession();

const url = 'https://graphql.anilist.co';
const authUrl = `https://anilist.co/api/v2/oauth/authorize`;

const clientId: string = Constants.manifest?.extra?.anilistClientId;

export default function HomeTabScreen() {
    const { getItem, setItem } = useAsyncStorage('anilist_token');
    const [mediaList, setMediaList] = useState<MediaList[]>([]);
    const [anilistToken, setAnilistToken] = useState<string | null>(null);
    const [viewer, setViewer] = useState<User | null>(null);
    
    useEffect(() => {
        Linking.addEventListener('url', (e) => {
            if (anilistToken === null) {
                const params = QueryString.parse(e.url.replace('#', '?'));
                const accessToken = params['access_token'];
                if (typeof accessToken !== 'string') {
                    throw new Error('Redirect URL does not contain an access_token param\n');
                }
                
                setAnilistToken(accessToken);
                setItem(accessToken).catch(err => console.error(err));
            }
        });

        getItem().then(token => {
            setAnilistToken(token);
        });
    }, []);

    useEffect(() => {
        if (anilistToken === null) {
            return;            
        }

        fetchViewer(anilistToken)
            .then(async (user) => {
                setViewer(user);

                try {
                    const newMediaList = await fetchMediaData(anilistToken, user.id);
                    setMediaList(newMediaList);
                } catch (err) {
                    console.error(err);
                }
            })
            .catch(err => console.error(err));
    }, [anilistToken]);

    const RenderItem: ListRenderItem<MediaList> = ({ item, index }) => {
        // check if this is the last item on the list
        const isLast = index === (mediaList.length - 1);
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
            {(anilistToken === null) ? (
                <Button 
                    mode="contained"
                    onPress={handleLogInBtnPress}
                >
                    Log in
                </Button>
            ) : (
                <>
                    <Text style={[styles.text, { margin: 15, color: 'rgb(159,173,189)', }]}>
                        Anime in Progress
                    </Text>
                    <View style={styles.cardListWrapper}>
                            <FlatList
                                data={mediaList}
                                renderItem={RenderItem}
                                keyExtractor={item => item.media.id.toString()}
                                horizontal={true}
                            />
                    </View>
                </>
            )}

            <Text style={{ color: 'white', marginTop: 20 }}>
                {viewer == null ? 'Nada' : viewer.name}
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
                source={{
                    uri: coverImage,
                }} 
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

async function fetchViewer(accessToken: string): Promise<User> {
    const query = `
        query {
            Viewer {
                id
                name
            }
        }
    `;
    
    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: {},
        }),
    };
    
    const res = await fetch(url, options);
    const user = (await res.json()).data.Viewer as User;
    return user;
}

async function fetchMediaData(accessToken: string, userId: string): Promise<MediaList[]> {
    const query = `
        query ($id: Int, $page: Int, $perPage: Int) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                mediaList (userId: $id, type: ANIME, status: CURRENT, sort: UPDATED_TIME_DESC) {
                    progress
                    media {
                        id
                        episodes
                        title {
                            romaji
                            english
                            native
                        }
                        coverImage {
                            medium
                        }
                    }
                }
            }
        }
    `;

    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: {
                id: userId,
                page: 1,
                perPage: 50,
            },
        }),
    };

    const res = await fetch(url, options);
    const json = await res.json();
    const page = json.data.Page as Page;
    return page.mediaList;
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