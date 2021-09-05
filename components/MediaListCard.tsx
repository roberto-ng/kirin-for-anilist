import React, { memo } from 'react';
import { 
    StyleSheet, 
    View, 
    Image,
    ImageBackground,
    Pressable,
} from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MediaList, MediaListStatus } from '../model/anilist';

interface MediaListCardProps {
    item: MediaList,
}

function MediaListCard({ item }: MediaListCardProps): JSX.Element {
    const navigation = useNavigation();

    const title  = item.media.title.romaji;
    const score  = item.media.mediaListEntry.score; 
    const total  = item.media.episodes ?? item.media.chapters;
    const status = item.media.mediaListEntry.status;
    
    let progress = null;
    if (total == null) {
        progress = `${item.progress}`;
    } else {
        progress = `${item.progress}/${total}`;
    }

    const handleCardPress = () => {
        navigation.navigate('Media', {
            media: item.media,
            title: item.media.title.romaji,
        });
    };
    
    return (
        <Pressable 
            style={styles.pressable} 
            onPress={handleCardPress}
        >
            <View style={styles.container}>
                <View style={styles.converImageWrapper}>
                    <ImageBackground 
                        source={{ uri: item.media.coverImage.large }}
                        style={styles.coverImage} 
                    >
                        <Pressable 
                            android_ripple={{ color: 'white' }} 
                            style={styles.coverImage} 
                            onPress={handleCardPress}
                        >
                        </Pressable>
                    </ImageBackground>
                </View>

                <View style={styles.mediaDetails}>
                    <Text numberOfLines={3} style={styles.title}>
                        {title}
                    </Text>
                    
                    {(status !== MediaListStatus.PLANNING) && (
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
                    )}
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        width: '100%',
        marginBottom: 7,
        marginTop: 7,
        borderRadius: 3,
    },
    container: {
        width: '100%',
        height: 130,
        borderRadius: 3,
        flexDirection: 'row',
        backgroundColor: '#151F2E',
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

export default memo(MediaListCard);