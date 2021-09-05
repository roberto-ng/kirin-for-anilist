import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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

    return (
        <View style={styles.container}>
            <Image 
                style={styles.coverImage} 
                source={{ uri: media.coverImage.large }} 
            />
        </View>
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
        margin: 10,
    },
});