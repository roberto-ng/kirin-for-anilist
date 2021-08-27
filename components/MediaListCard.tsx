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
        <View style={styles.touchableContainer}>
            <Pressable onPress={() => {}}>
                <View style={styles.container}>
                    <View style={styles.coverImage}>
                        <Image 
                            source={{ uri: item.media.coverImage.large }}
                            style={styles.coverImage} 
                        />
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
        </View>
    );
}

const styles = StyleSheet.create({
    touchableContainer: {
        backgroundColor: '#151F2E',
        marginTop: 7,
        marginBottom: 7,
    },
    container: {
        borderRadius: 3,
        height: 125,
        flexDirection: 'row',
    },
    coverImage: {
        height: 125,
        width: 95,
        borderRadius: 4,
    },
    mediaDetails: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        padding: 8,
        width: '80%',
    },
    mediaDetailsBottom: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    title: {
        fontSize: 16,
        flexWrap: 'wrap',
        color: 'white',
        width: '90%',
    },
    progress: {
        fontSize: 14,
    },
    score: {
        fontSize: 20,
        marginRight: 20,
    },
});