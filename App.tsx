import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import MainScreen from './screens/MainScreen';
import { store, StoreState, anilistSlice } from './store/store';
import { 
    Media, 
    MediaList, 
    User, 
    Page,
    ActivityUnion, 
} from './model/anilist';

WebBrowser.maybeCompleteAuthSession();

const backgroundColor = '#0B1622';
const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#0B1622'
    },
};

const url = 'https://graphql.anilist.co';
const authUrl = `https://anilist.co/api/v2/oauth/authorize`;
const Stack = createStackNavigator();

function AppContent() {
    const dispatch = useDispatch();
    const state = useSelector((state: StoreState) => state);
    const { getItem, setItem } = useAsyncStorage('anilist_token');

    const fetchData = async (accessToken: string) => {
        const user = await fetchViewer(accessToken);
        const animeInProgress = await fetchAnimeInProgress(accessToken, user.id);
        const mangaInProgress = await fetchMangaInProgress(accessToken, user.id);
        const activities = await fetchActivities(accessToken);

        if (state.anilist.animeInProgress.length === 0) {
            dispatch(anilistSlice.actions.setToken(accessToken));
            dispatch(anilistSlice.actions.setUser(user));
            dispatch(anilistSlice.actions.addToAnimeInProgressList(animeInProgress));
        }
        if (state.anilist.mangaInProgress.length === 0) {
            dispatch(anilistSlice.actions.addToMangaInProgressList(mangaInProgress));
        }
        if (state.anilist.activities.length === 0) {
            dispatch(anilistSlice.actions.setActivities(activities));
        }
    };

    useEffect(() => {
        Linking.addEventListener('url', async (e) => {
            if (state.anilist.token == null) {
                try {
                    const parsedURL = Linking.parse(e.url.replace('#', '?'));
                    const accessToken = parsedURL.queryParams['access_token']
                    if (typeof accessToken !== 'string') {
                        throw new Error('Redirect URL does not contain an access_token param\n');
                    }
                
                    await setItem(accessToken);
                    await fetchData(accessToken);
                } catch (err) {
                    console.error(err);
                }
            }
        });

        getItem().then(async (accessToken) => {
            if (accessToken !== null) {
                try {
                    await fetchData(accessToken);
                } catch (err) {
                    console.error(err);
                }
            }
        });
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor }}>
            <NavigationContainer theme={MyTheme}>
                <Stack.Navigator 
                    initialRouteName="Main"
                >
                    <Stack.Screen 
                        name="Main" 
                        component={MainScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </View>
    );
}

export default function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}

async function fetchViewer(accessToken: string): Promise<User> {
    const query = `
        query {
            Viewer {
                id
                name
                avatar {
                    medium
                    large
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
            variables: {},
        }),
    };
    
    const res = await fetch(url, options);
    const user = (await res.json()).data.Viewer as User;
    return user;
}

async function fetchAnimeInProgress(accessToken: string, userId: string): Promise<MediaList[]> {
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
                    updatedAt
                    media {
                        id
                        episodes
                        status
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
    if (page.mediaList == null) {
        throw new Error('The Page object has no mediaList member');
    }

    return page.mediaList;
}

async function fetchMangaInProgress(accessToken: string, userId: string): Promise<MediaList[]> {
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
                mediaList (userId: $id, type: MANGA, status: CURRENT, sort: UPDATED_TIME_DESC) {
                    progress
                    updatedAt
                    media {
                        id
                        episodes
                        chapters
                        status
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
    if (page.mediaList == null) {
        throw new Error('The Page object has no mediaList member');
    }

    return page.mediaList;
}

async function fetchActivities(accessToken: string): Promise<ActivityUnion[]> {
    const query = `
        query ($page: Int, $perPage: Int) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                activities (isFollowing: true, sort: ID_DESC) {
                    ...on TextActivity {
                        id
                        userId
                        type
                        text
                        isLocked
                        likeCount
                        replyCount
                        siteUrl
                        isSubscribed
                        user {
                            id
                            name
                            avatar {
                                medium
                                large
                            }
                        }
                    }

                    ...on ListActivity {
                        id
                        userId
                        type
                        status
                        progress
                        media {
                            id
                            episodes
                            status
                            title {
                                romaji
                                english
                                native
                            }
                            coverImage {
                                medium
                            }    
                        }
                        isLocked
                        likeCount
                        replyCount
                        siteUrl
                        isSubscribed
                        user {
                            id
                            name
                            avatar {
                                medium
                                large
                            }
                        }
                    }

                    ...on MessageActivity {
                        id
                        recipientId
                        messengerId     
                        message
                        siteUrl
                        isSubscribed
                        messenger {
                            id
                            name
                            avatar {
                                medium
                                large
                            }
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
                page: 1,
                perPage: 15,
            },
        }),
    };

    const res = await fetch(url, options);
    const json = await res.json();
    const page = json.data.Page as Page;
    if (page.activities == null) {
        throw new Error('The Page object has no \'activities\' member');
    }

    return page.activities;
}