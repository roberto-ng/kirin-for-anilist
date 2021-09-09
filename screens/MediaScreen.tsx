import 'ts-replace-all';
import React from 'react';
import { 
    View, 
    ScrollView, 
    StyleSheet, 
    Image, 
    ImageBackground, 
    Platform,
    ToastAndroid, 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Paragraph, Text } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import * as Clipboard from 'expo-clipboard';
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

    const formatDescription = (description: string): string => {
        return description
            .replaceAll('<br>', '')
            .replaceAll('<i>', '')
            .replaceAll('</i>', '');
    };

    const handleTitleLongPress = () => {
        Clipboard.setString(title);

        if (Platform.OS === 'android') {
            ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
        }
    };

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
                <Text 
                    style={[styles.text, styles.title]}
                    onLongPress={handleTitleLongPress}
                >
                    {title}
                </Text>

                <View style={styles.descriptionContainer}>
                    <Text style={[styles.text, styles.descriptionLabel]}>
                        Description:
                    </Text>
                    <Paragraph 
                        style={[styles.text, styles.descriptionText]}
                        selectable={true}
                    >
                        {formatDescription(media.description ?? '')}
                    </Paragraph>
                </View>
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
    text: {
        color: 'rgb(159,173,189)',
    },
    descriptionContainer: {
        backgroundColor: '#151F2E',
        margin: 20,
        marginTop: 10,
        borderRadius: 5,
        padding: 10,
    },
    descriptionLabel: {
        fontSize: 16,
    },
    descriptionText: {
        fontSize: 16,
        marginTop: 10,
    },
});