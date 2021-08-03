import React from 'react';
import { 
    StyleSheet, 
    View, 
    Image,
    Platform,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { MediaList } from '../model/anilist';

export interface MediaListItemCardProps {
    mediaListItem: MediaList,
    isLast: boolean,
    isFirst: boolean,
}

export default function MediaListItemCard({ 
    isLast, 
    isFirst, 
    mediaListItem,
}: MediaListItemCardProps) {
    const { media } = mediaListItem;

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
                        Progress: {mediaListItem.progress}/{media.episodes} +
                    </Text>
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
    },
    cardContentInfoText: {
        fontSize: 14,
    },
});
