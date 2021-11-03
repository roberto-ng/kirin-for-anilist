import React, { useState, useMemo } from 'react';
import { 
    StyleSheet, 
    View, 
    Image,
    Platform,
    ImageBackground,
    TouchableWithoutFeedback,
} from 'react-native';
import { Trans } from '@lingui/macro';
import { useNavigation } from '@react-navigation/native';
import { IconButton, Snackbar, Text } from 'react-native-paper';
import { MediaList } from '../model/anilist';
import { incrementMediaProgression } from '../api/anilist';

export interface HomeMediaListProps {
    mediaListItem: MediaList,
    isLast: boolean,
    isFirst: boolean,
    token?: string,
    onError: (err: any) => void;
}

export default function HomeMediaListCard({ 
    isLast, 
    isFirst, 
    mediaListItem,
    token,
    onError,
}: HomeMediaListProps) {
    const navigation = useNavigation();
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [item, setItem] = useState<MediaList>(mediaListItem);
    const { media } = mediaListItem;

    // calculate how many episodes behind the user is
    const episodesBehind = useMemo<number>(() => {
        const nextEpisode: number | undefined = media?.nextAiringEpisode?.episode;
        if (nextEpisode != null) {
            const difference = nextEpisode - (item.progress ?? 0);
            if (difference >= 1) {
                return difference - 1;
            }
        }

        return 0;
    }, []);
    
    const formatProgress = (): string => {
        const total = media.episodes ?? media.chapters;
        let mediaProgress = item.progress.toString();
        if (total != null) {
            mediaProgress += `/${total}`;
        }

        return mediaProgress;
    };

    const handleIncrementButtonPress = async () => {
        if (token == null) {
            console.error('Auth token is not avalable.');
            return;
        }

        try {
            setIsUpdating(true);
            await incrementMediaProgression(token, item);
            setItem({...item, progress: item.progress + 1});
        } catch (err) {
            onError(err);
        }

        setIsUpdating(false);
    };

    const openMediaPage = () => {
        //@ts-ignore
        navigation.navigate('Media', {
            media: item.media,
            title: item.media.title.romaji,
        });
    };

    return (
        <View 
            style={[styles.itemCard, { 
                marginRight: (isLast) ? 10 : 25,
                marginLeft: (isFirst) ? 10 : 0,
            }]}
        >
            <TouchableWithoutFeedback 
                style={styles.cardCoverImage}
                onPress={openMediaPage}
            >
                <ImageBackground
                    style={styles.cardCoverImage} 
                    source={{ uri: media.coverImage.large }} 
                />
            </TouchableWithoutFeedback>
            

            <View style={styles.cardContent}>
                <Text 
                    style={[styles.cardContentText, styles.cardContentTitle]}
                    numberOfLines={1}
                    onPress={openMediaPage}
                >
                    {media.title.romaji}
                </Text>
            
                {(episodesBehind > 0) && (
                    <Text style={styles.episodesBehind}>
                        <Trans>episodes_behind.{episodesBehind}</Trans>
                    </Text>
                )}
                
                <View style={styles.cardContentInfo}>    
                    <View style={styles.progress}>
                        <Text style={[styles.cardContentText, styles.cardContentInfoText]}>
                            <Trans 
                                id="progress.label"
                                values={{ progress: formatProgress() }}
                            />
                        </Text>
                        <IconButton 
                            icon="plus" 
                            color="rgb(159,173,189)" 
                            size={23}
                            disabled={isUpdating} // disable the button if the media progress is being updated
                            onPress={handleIncrementButtonPress}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    episodesBehind: {
        top: 14,
        textAlign: 'left',
        marginLeft: 9,
        color: 'rgb(61,180,242)',
    },
    cardContentTitle: {
        fontSize: 16,
    },
    cardContentInfo: {
        top: 5,
        flexDirection: 'column',
        alignItems: 'center',
    },
    progress: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    cardContentInfoText: {
        fontSize: 14,
    },
    plusButton: {
        color: 'white',
    },
});
