import React from 'react';
import { View, ScrollView, StyleSheet, Image, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import { Media, MediaList } from '../model/anilist';

interface Props {
    route: {
        params: {
            media: Media,
            listEntry?: MediaList,
        },
    },
}

export default function MediaScreen({ route }: Props): JSX.Element {
    const { media } = route.params;
    const navigation = useNavigation();
    const title = media.title.romaji;

    return (
        <ScrollView style={styles.container}>
            <ImageBackground
                style={styles.banner}
                source={{ uri: media.bannerImage }}
            >
                <View style={styles.bannerWrapper}>
                    <Shadow 
                        distance={5} 
                        startColor="rgba(0, 0, 0, 0.4)" 
                        finalColor="rgba(0, 0, 0, 0)" 
                    >
                        <Image 
                            style={styles.coverImage} 
                            source={{ uri: media.coverImage.large }} 
                        />
                    </Shadow>
                </View>
            </ImageBackground>

            <View style={styles.contentWrapper}>
                <Text style={styles.title}>{title}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    coverImage: {
        width: 170,
        height: 230,
        borderRadius: 5,
        //margin: 10,
    },
    banner: {
        width: '100%',
        height: 230,
    },
    bannerWrapper: {
        marginTop: 60,
        marginLeft: 20,
    },
    contentWrapper: {
        marginTop: 60,
    },
    title: {
        fontSize: 20,
        marginTop: 10,
        marginLeft: 20,
    },
});