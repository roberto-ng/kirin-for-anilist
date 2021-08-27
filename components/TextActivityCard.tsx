import React from 'react';
import { 
    StyleSheet, 
    View, 
    Image,
    Platform,
} from 'react-native';
import { TextActivity, MessageActivity, ActivityType } from '../model/anilist';
import { Button, Text } from 'react-native-paper';
import { getRelativeTime } from '../utils';

interface TextActivityCardProps {
    activity: TextActivity | MessageActivity,
}

export default function TextActivityCard({ activity }: TextActivityCardProps) {
    let text = '';
    let username = '';

    if (activity.type === ActivityType.TEXT) {
        const textActivity = activity as TextActivity;
        text = textActivity.text;
        username = textActivity.user.name;
    } else if (activity.type === ActivityType.MESSAGE) {
        const messageActivity = activity as MessageActivity;
        text = messageActivity.message;
        username = messageActivity.messenger.name;
    }

    return (
        <View style={styles.card}>            
            <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                    <Text 
                        style={[styles.username, styles.cardContentTitle]}
                    >
                        {username}
                    </Text> 
                    <Text style={[styles.cardContentText, { marginLeft: 5 }]}>
                        {getRelativeTime(activity.createdAt)}
                    </Text>
                </View>

                <Text 
                    style={[styles.cardContentText, styles.cardContentTitle]}
                >
                    {text}
                </Text>            
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
        justifyContent: 'flex-start',
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
        fontSize: 14,
    },
    cardTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
});
