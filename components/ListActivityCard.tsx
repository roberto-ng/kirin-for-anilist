import React, { useReducer } from 'react';
import { 
    StyleSheet, 
    View, 
    Image,
    Platform,
    ImageBackground,
    TouchableWithoutFeedback,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { t } from "@lingui/macro";
import { Trans } from '@lingui/macro';
import { ActivityType, ActivityUnion, ListActivity } from '../model/anilist';
import { getRelativeTime } from '../utils';

interface ListActivityCardProps {
    activity: ListActivity,
}

export default function ListActivityCard({ activity }: ListActivityCardProps) {
    const navigation = useNavigation();
    const title = activity.media.title.romaji;

    let text = null;
    let { progress } = activity;
    switch (activity.status) {
        case 'read chapter':
            text = t`read_chapter_${progress}`;
            break;
        
        case 'watched episode':
            text = t`watched_episode_${progress}`; // `Watched episode ${progress} of `;
            break;
        
        case 'plans to watch':
            text = t`plans_to_watch`; // `Plans to watch `;
            break;

        case 'plans to read':
            text = t`plans_to_read`; // `Plans to read `;
            break;
        
        case 'paused watching':
            text = t`paused_watching`; // `Paused watching `;
            break;
        
        case 'paused reading':
            text = t`paused_reading`; // `Paused reading `;
            break;
        
        case 'dropped':
            text = t`dropped`; // `Dropped `;
            break;

        case 'completed':
            text = t`completed`; // `Completed `;
            break;

        default:
            text = '';
            break;
    }

    const openMediaPage = () => {
        //@ts-ignore
        navigation.navigate('Media', {
            media: activity.media,
            title: activity.media.title.romaji,
        });
    };

    return (
        <View style={styles.card}>
            <TouchableWithoutFeedback onPress={openMediaPage}>
                <ImageBackground
                    style={styles.cardCoverImage} 
                    source={{ uri: activity.media.coverImage.large }} 
                />
            </TouchableWithoutFeedback>
            
            <View style={styles.cardContent}>
                <View style={styles.cardContentInfo}>
                    <View style={styles.cardTop}>
                        <Text 
                            style={[styles.username, styles.cardContentInfoText]}
                        >
                            {activity.user.name}
                        </Text>
                        <Text style={[styles.cardContentText, { marginLeft: 5 }]}>
                            {getRelativeTime(activity.createdAt)}
                        </Text>
                    </View>
                    
                    <Text 
                        style={[styles.cardContentText, styles.cardContentInfoText]}
                        numberOfLines={3}
                    >
                        {text} 
                        <Text 
                            style={styles.title} 
                            numberOfLines={3}
                            onPress={openMediaPage}
                        >
                            {' ' + title}
                        </Text>
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
        marginBottom: 5,
    },
    title: {
        color: 'rgb(61,180,242)',
    },
});
