import React from 'react';
import { useState } from 'react';
import { 
    StyleSheet, 
    View, 
    Image,
    Platform,
} from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { MediaList } from '../model/anilist';
import { increaseMediaProgression } from '../api/anilist';

export interface MediaListItemCardProps {
    mediaListItem: MediaList,
    isLast: boolean,
    isFirst: boolean,
    token?: string,
}

export default function MediaListItemCard({ 
    isLast, 
    isFirst, 
    mediaListItem,
    token,
}: MediaListItemCardProps) {
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [item, setItem] = useState<MediaList>(mediaListItem);
    const { media } = mediaListItem;
    
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
            await increaseMediaProgression(token, item);
            setItem({...item, progress: item.progress + 1});
        } catch (err) {
            console.error(err);
        }

        setIsUpdating(false);
    };

    return (
        <View 
            style={[styles.itemCard, { 
                marginRight: (isLast) ? 10 : 25,
                marginLeft: (isFirst) ? 10 : 0,
            }]}
        >
            <Image 
                style={styles.cardCoverImage} 
                source={{ uri: media.coverImage.medium }} 
            />

            <View style={styles.cardContent}>
                <Text 
                    style={[styles.cardContentText, styles.cardContentTitle]}
                    numberOfLines={1}
                >
                    {media.title.romaji}
                </Text>
            
                <View style={styles.cardContentInfo}>
                    <Text style={[styles.cardContentText, styles.cardContentInfoText]}>
                        Progress: {formatProgress()}
                    </Text>
                    <IconButton 
                        icon="plus" 
                        color="rgb(159,173,189)" 
                        size={23}
                        disabled={isUpdating} // disable the button if the media progress is being updated
                        onPress={handleIncrementButtonPress}
                    >
                        +
                    </IconButton>
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
    cardContentTitle: {
        fontSize: 16,
    },
    cardContentInfo: {
        marginBottom: 1,
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
