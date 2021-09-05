import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { FC, useEffect, useState } from 'react';
import { useAsyncStorage } from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useSelector, useDispatch } from 'react-redux';
import { 
    StyleSheet, 
    View, 
    FlatList, 
    ListRenderItem, 
    Image,
    Platform,
    ScrollView,
    Linking,
} from 'react-native';
import { Button, Text, ActivityIndicator, Colors, Snackbar } from 'react-native-paper';
import { StoreState, anilistSlice } from '../../store/store';
import HomeMediaListCard from '../../components/HomeMediaListCard';
import TextActivityCard from '../../components/TextActivityCard';
import ListActivityCard from '../../components/ListActivityCard';
import { 
    fetchViewer, 
    fetchActivities, 
    fetchMangaInProgress, 
    fetchAnimeInProgress,
} from '../../api/anilist';
import { 
    ActivityType, 
    ActivityUnion, 
    User, 
    MediaList, 
    MediaStatus, 
} from '../../model/anilist';

const authUrl = `https://anilist.co/api/v2/oauth/authorize`;
const clientId: string = Constants.manifest?.extra?.anilistClientId;

interface MediaSectionProps {
    name: string,
    token: string,
    list: MediaList[],
    onError: (err: any) => void,
}

export default function HomeTabScreen({}) {
    const anilist = useSelector((state: StoreState) => state.anilist);
    const [hasFetchedData, setHasFetchedData] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [animeAiring, setAnimeAiring] = useState<MediaList[]>([]);
    const [animeFinishedAiring, setAnimeFinishedAiring] = useState<MediaList[]>([]);
    const [mangaInProgress, setMangaInProgress] = useState<MediaList[]>([]);
    const [activities, setActivities] = useState<ActivityUnion[]>([]);

    const fetchData = async (accessToken: string, user: User) => {
        const animeInProgressResponse = await fetchAnimeInProgress(accessToken, user.id);
        const mangaInProgressResponse = await fetchMangaInProgress(accessToken, user.id);
        const activitiesResponse = await fetchActivities(accessToken);

        if (animeAiring.length === 0 && animeFinishedAiring.length === 0) {
            const airing = animeInProgressResponse.filter(m => m.media.status === MediaStatus.RELEASING);
            const finished = animeInProgressResponse.filter(m => m.media.status === MediaStatus.FINISHED);
            setAnimeAiring(airing);
            setAnimeFinishedAiring(finished);
        }
        if (mangaInProgress.length === 0) {
            setMangaInProgress(mangaInProgressResponse);
        }
        if (activities.length === 0) {
            setActivities(activitiesResponse);
        }

        setIsLoading(false);
    };

    const handleLogInBtnPress = () => {
        Linking.openURL(authUrl + '?client_id=' + clientId + '&response_type=token');
    };

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

    const onError = (err: any) => {
        if (err instanceof Error) {
            setErrorMsg(err.message);
        } else {
            setErrorMsg(err + '');
        }

        console.log(err);
        setShowError(true);
    };

    useEffect(() => {
        if (anilist.token == null || anilist.user == null) {
            return;
        }

        if (!hasFetchedData) {
            setHasFetchedData(true);
            fetchData(anilist.token, anilist.user)
                .catch((err) => console.error(err));
        }
    });

    return (
        <>
            <ScrollView contentContainerStyle={styles.container}>
                {(anilist.token == null) ? (
                    <>
                        <Button 
                            mode="contained"
                            onPress={handleLogInBtnPress}
                        >
                            Log in
                        </Button>
                    </>
                ) : (
                    <>
                        {(animeAiring.length > 0) && (
                            <MediaSection 
                                name="Airing" 
                                list={animeAiring} 
                                token={anilist.token} 
                                onError={onError}
                            />
                        )}

                        {(animeFinishedAiring.length > 0) && (
                            <MediaSection 
                                name="Anime in Progress" 
                                list={animeFinishedAiring} 
                                token={anilist.token} 
                                onError={onError}
                            />
                        )}

                        {(mangaInProgress.length > 0) && (
                            <MediaSection 
                                name="Manga in Progress" 
                                list={mangaInProgress} 
                                token={anilist.token} 
                                onError={onError}
                            />
                        )}

                        {(activities.length > 0) && (
                            <>
                                <Text style={[styles.text, { margin: 15, color: 'rgb(159,173,189)', }]}>
                                    Activity
                                </Text>

                                <View style={styles.activities}>
                                    {activities.map((activity, index) => {
                                        const ActivityCard = getActivityCard(activity);
                                        return (
                                            <ActivityCard 
                                                activity={activity as any} 
                                                key={index}                                             />
                                            );
                                        })
                                    }     
                                </View>
                            </>
                        )}

                        {(isLoading) && (
                            <View style={styles.activityIndicatorContainer}>
                                <ActivityIndicator size={50} animating={true} color={Colors.white} />
                            </View>
                        )}
                    </>
                )}
                <StatusBar style="light" />
            </ScrollView>
            <Snackbar
                visible={showError}
                onDismiss={() => {
                    setErrorMsg(null);
                    setShowError(false);
                }}
                action={{
                    label: 'Ok',
                    onPress: () => {
                        setErrorMsg(null);
                        setShowError(false);
                    },
                }}
            >
                {errorMsg}
            </Snackbar>
        </>
    );
};

function MediaSection({ name, token, list, onError }: MediaSectionProps) {
    return (
        <>
            <Text style={[styles.text, { margin: 15, color: 'rgb(159,173,189)', }]}>
                {name}
            </Text>
            <View style={styles.cardListWrapper}>
                <FlatList
                    data={list}
                    keyExtractor={item => item.id.toString()}
                    horizontal={true}
                    persistentScrollbar={true}
                    renderItem={({ item, index }) => {
                        // check if this is the last item on the list
                        const isLast = index === (list.length - 1);
                        const isFirst = index === 0;

                        return (
                            <HomeMediaListCard 
                                mediaListItem={item} 
                                isLast={isLast}
                                isFirst={isFirst}
                                token={token}
                                onError={onError}
                            />
                        );
                    }}
                />
            </View>
        </>
    );
}

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
    activityIndicatorContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});