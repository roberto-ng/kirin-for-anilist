import React, { useReducer } from 'react';
import { 
    StyleSheet, 
    View, 
    Image,
    Platform,
} from 'react-native';
import { ActivityType, ActivityUnion, ListActivity } from '../model/anilist';
import { Button, Text } from 'react-native-paper';

interface ListActivityCardProps {
    activity: ListActivity,
}

export default function ListActivityCard({ activity }: ListActivityCardProps) {
    const episodes = activity.media.episodes || '?';
    const title = activity.media.title.romaji;

    return (
        <View style={styles.card}>
            <Image 
                style={styles.cardCoverImage} 
                source={{ uri: activity.media.coverImage.medium }} 
            />
            
            <View style={styles.cardContent}>
                <View style={styles.cardContentInfo}>
                    <Text 
                        style={[styles.username, styles.cardContentInfoText]}
                    >
                        {activity.user.name}
                    </Text>
                    <Text 
                        style={[styles.cardContentText, styles.cardContentInfoText]}
                        numberOfLines={3}
                    >
                        Progress: {activity.progress}/{episodes || '?'} of {title}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#151F2E',
        height: 115,
        width: 255,
        borderRadius: 3,
        flexDirection: 'row',
        margin: 6,
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
    username: {
        color: 'rgb(61,180,242)',
    },
    cardContentTitle: {
        fontSize: 16,
    },
    cardContentInfo: {
        marginBottom: 1,
    },
    cardContentInfoText: {
        fontSize: 15,
    },
});
