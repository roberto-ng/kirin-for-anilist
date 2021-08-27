import React, { useReducer } from 'react';
import { 
    StyleSheet, 
    View, 
    Image,
    Platform,
} from 'react-native';
import { ActivityType, ActivityUnion, ListActivity } from '../model/anilist';
import { Button, Text } from 'react-native-paper';
import { dateFromUnixTimestamp } from '../utils';

interface ListActivityCardProps {
    activity: ListActivity,
}

const DIVISIONS = [
    { amount: 60, name: 'seconds' },
    { amount: 60, name: 'minutes' },
    { amount: 24, name: 'hours' },
    { amount: 7, name: 'days' },
    { amount: 4.34524, name: 'weeks' },
    { amount: 12, name: 'months' },
    { amount: Number.POSITIVE_INFINITY, name: 'years' }
]

export default function ListActivityCard({ activity }: ListActivityCardProps) {
    const title = activity.media.title.romaji;

    let text = null;
    switch (activity.status) {
        case 'read chapter':
            text = `Read chapter ${activity.progress} of ${title}`;
            break;
        
        case 'watched episode':
            text = `Watched episode ${activity.progress} of ${title}`;
            break;
        
        case 'plans to watch':
            text = `Plans to watch ${title}`;
            break;

        case 'plans to read':
            text = `Plans to read ${title}`;
            break;
        
        case 'paused watching':
            text = `Paused watching ${title}`;
            break;
        
        case 'paused reading':
            text = `Paused reading ${title}`;
            break;
        
        case 'dropped':
            text = `Dropped ${title}`;
            break;

        case 'completed':
            text = `Completed ${title}`;
            break;

        default:
            text = '';
            break;
    }

    const getRelativeTime = (createdAt: number) => {
        const date = dateFromUnixTimestamp(createdAt);
        let duration = (date.getTime() - Date.now()) / 1000;
        const formatter = new Intl.RelativeTimeFormat('us');
        for (const division of DIVISIONS) {
            if (Math.abs(duration) < division.amount) {
                return formatter.format(Math.round(duration), division.name as any);
            }
            duration /= division.amount;
        }
    }

    return (
        <View style={styles.card}>
            <Image 
                style={styles.cardCoverImage} 
                source={{ uri: activity.media.coverImage.large }} 
            />
            
            <View style={styles.cardContent}>
                <View style={styles.cardContentInfo}>
                    <View style={styles.cardTop}>
                        <Text 
                            style={[styles.username, styles.cardContentInfoText]}
                        >
                            {activity.user.name}
                        </Text>
                        <Text style={{ marginLeft: 5 }}>
                            {getRelativeTime(activity.createdAt)}
                        </Text>
                    </View>
                    
                    <Text 
                        style={[styles.cardContentText, styles.cardContentInfoText]}
                        numberOfLines={3}
                    >
                        {text}
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
        //width: 255,
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
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
