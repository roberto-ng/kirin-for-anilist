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

interface MediaData {
    id: string;
    title: {
        romaji: string;
        english: string;
        native: string;
    };
    coverImage: {
        medium: string;
    };
}

interface User {
    id: string;
    name: string;
}

WebBrowser.maybeCompleteAuthSession();

const url = 'https://graphql.anilist.co';
const IDS = [
    232,    // sakura
    124845, // wonder egg
    21507,  // mob 100
    20722,  // baraka
    21202,  // kono suba
];


const clientId: string = Constants.manifest?.extra?.anilistClientId;
const authUrl = `https://anilist.co/api/v2/oauth/authorize`;

export default function HomeTabScreen() {
    const { getItem, setItem } = useAsyncStorage('anilist_token');
    const [mediaDataList, setMediaDataList] = useState<MediaData[]>([]);
    const [anilistToken, setAnilistToken] = useState<string | null>(null);
    const [viewer, setViewer] = useState<User | null>(null);
    
    useEffect(() => {
        Linking.addEventListener('url', (e) => {
            if (anilistToken === null) {
                const params = QueryString.parse(e.url.replace('#', '?'));
                const accessToken = params['access_token'];
                if (typeof accessToken !== 'string') {
                    throw new Error('Redirect URL does not contain an access_token param\n' + typeof accessToken);
                }
                
                console.log(accessToken);
                setAnilistToken(accessToken);
                setItem(accessToken).catch(err => console.error(err));
            }
        });

        getItem().then(token => {
            setAnilistToken(token);
        });
    }, []);

    useEffect(() => {
        if (anilistToken !== null) {
            fetchViewer(anilistToken)
            .then(user => {
                    setViewer(user)
                    console.log(user);
                })
                .catch(err => console.error(err));

            fetchMediaData(anilistToken)
                .then(dataList => setMediaDataList(dataList))
                .catch(err => console.error(err));
        }
    }, [anilistToken]);

    const RenderItem: ListRenderItem<MediaData> = ({ item, index }) => {
        // check if this is the last item on the list
        const isLast = index === (mediaDataList.length - 1);
        const isFirst = index === 0;
        
        return (
            <ItemCard 
                title={item.title.romaji} 
                coverImage={item.coverImage.medium} 
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
            <Text style={[styles.text, { margin: 15, color: 'rgb(159,173,189)', }]}>
                Airing
            </Text>

            {(anilistToken === null) ? (
                <Button 
                    mode="contained"
                    onPress={handleLogInBtnPress}
                >
                    Log in
                </Button>
            ) : (
                <View style={styles.cardListWrapper}>
                        <FlatList
                            data={mediaDataList}
                            renderItem={RenderItem}
                            keyExtractor={item => item.id.toString()}
                            horizontal={true}
                        />
                </View>
            )}

            <Text style={{ color: 'white' }}>
                {viewer == null ? 'Nada' : viewer.name}
            </Text>

            <StatusBar style="light" />
        </View>
    );
};

function ItemCard({ title, isLast, isFirst, coverImage }: any) {
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
                        Progress: 0/0 +
                    </Text>
                </View>
            </View>

        </View>
    );
};

async function fetchViewer(accessToken: string): Promise<User> {
    const userQuery = `
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
            query: userQuery,
            variables: {},
        }),
    };
    
    const res = await fetch(url, options);
    const user = (await res.json()).data.Viewer as User;
    return user;
}

async function fetchMediaData(accessToken: string): Promise<MediaData[]> {

    return [];

    /*
    const query = `
        query ($id: Int) {
            Media (id: $id, type: ANIME) {
                id
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
    `;

    const responses = await Promise.all(
        ids.map(id => {
            const variables = { id };
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            };

            return fetch(url, options);
        })
    );

    const jsonArray = await Promise.all(
        responses.map((res) => {
            if (!res.ok) {
                throw new Error(res.statusText);
            }

            return res.json();
        })
    );
    const medias = jsonArray.map(item => item.data.Media);
    return medias;
    */
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