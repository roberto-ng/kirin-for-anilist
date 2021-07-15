import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'
import React, { FC, useEffect, useState } from 'react'
import { 
    StyleSheet, 
    View, 
    FlatList, 
    ListRenderItem, 
    Image,
    Platform,
} from 'react-native'
import { Text } from 'react-native-paper'
import * as AuthSession from 'expo-auth-session'

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

const url = 'https://graphql.anilist.co';
const IDS = [
    232,    // sakura
    124845, // wonder egg
    21507,  // mob 100
    20722,  // baraka
    21202,  // kono suba
];

const HomeTabScreen: FC = () => {
    const [mediaDataList, setMediaDataList] = useState<MediaData[]>([]);

    const renderItem: ListRenderItem<MediaData> = ({ item, index }) => {
        // check if this is the last item on the list
        const isLast = index == (mediaDataList.length - 1);
        
        return (
            <ItemCard 
                title={item.title.romaji} 
                coverImage={item.coverImage.medium} 
                isLast={isLast}
            />
        );
    };

    useEffect(() => {
        console.log(AuthSession.makeRedirectUri())

        fetchMediaData(IDS)
            .then(dataList => setMediaDataList(dataList))
            .catch(e => console.error(e));
    }, []);

    const flatListWebStyle = {
        overflow: 'auto',
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { margin: 15, color: 'rgb(159,173,189)', }]}>
                Airing
            </Text>

            <View style={styles.cardListWrapper}>
                    <FlatList
                        data={mediaDataList}
                        renderItem={renderItem}
                        keyExtractor={item => item.id.toString()}
                        horizontal={true}
                    />
            </View>

            <StatusBar style="light" />
        </View>
    );
};

const ItemCard: FC<any> = ({ title, isLast, coverImage }) => {
    return (
        <View 
            style={[styles.itemCard, { 
                marginRight: (isLast) ? 0 : 25,
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

async function fetchMediaData(ids: number[]): Promise<MediaData[]> {
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
        marginLeft: 10, 
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

export default HomeTabScreen;