import React, { useReducer } from 'react';
import { 
    StyleSheet, 
    View, 
    Image,
    ImageBackground,
    Pressable,
} from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { MediaList } from '../model/anilist';

interface MediaListCardProps {
    item: MediaList,
}

export default function MediaListCard({ item }: MediaListCardProps): JSX.Element {
    const title = item.media.title.romaji;
    const score = item.media.mediaListEntry.score; 
    const total = item.media.episodes ?? item.media.chapters;
    
    let progress = null;
    if (total == null) {
        progress = `${item.progress}`;
    } else {
        progress = `${item.progress}/${total}`;
    }
    
    return (
        <Pressable 
            style={styles.pressable} 
            android_ripple={{ color: 'white' }} 
            onPress={() => {}}
        >
            <View style={styles.container}>
                    <View style={styles.converImageWrapper}>
                        <ImageBackground 
                            source={{ uri: item.media.coverImage.large }}
                            style={styles.coverImage} 
                        >
                            <Pressable android_ripple={{ color: 'white' }} style={styles.coverImage} >
                            </Pressable>
                        </ImageBackground>
                    </View>
                    <View style={styles.mediaDetails}>
                        <Text numberOfLines={3} style={styles.title}>
                            {title}
                        </Text>
                        <View style={styles.mediaDetailsBottom}>
                            <Text style={styles.progress}>
                                Progress: {progress}
                            </Text>

                            {(score != null && score > 0) && (
                                <Text style={styles.score}>
                                    {score}
                                </Text>
                            )}
                        </View>
                    </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        width: '100%',
        backgroundColor: '#151F2E',
        marginBottom: 7,
        marginTop: 7,
        borderRadius: 3,
    },
    container: {
        width: '100%',
        height: 130,
        borderRadius: 3,
        flexDirection: 'row',
    },
    coverImage: {
        height: 115,
        width: 95,
    },
    converImageWrapper: {
        marginLeft: 8,
        height: '100%',
        justifyContent: 'center',
    },
    mediaDetails: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 8,
        height: '100%',
    },
    mediaDetailsBottom: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    title: {
        fontSize: 16,
        flexWrap: 'wrap',
        color: 'rgb(159,173,189)',
    },
    progress: {
        fontSize: 14,
        color: 'rgb(159,173,189)',
    },
    score: {
        fontSize: 20,
        marginRight: 5,
        color: 'rgb(159,173,189)',
    },
});