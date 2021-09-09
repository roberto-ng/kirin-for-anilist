import 'ts-replace-all';
import React, { useMemo } from 'react';
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
import { Paragraph, Text, Divider } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import * as Clipboard from 'expo-clipboard';
import { Media, MediaList } from '../model/anilist';
import { FlatList } from 'react-native-gesture-handler';

interface Props {
    route: {
        params: {
            media: Media,
            listEntry?: MediaList,
        },
    },
}

interface Information {
    title: string,
    value: string,
}

export default function MediaScreen({ route }: Props): JSX.Element {
    const { media } = route.params;
    const navigation = useNavigation();
    const title = media.title.romaji;

    const informations = useMemo((): Information[] => {
        const { startDate, endDate } = media;

        return [
            {
                title: 'Format',
                value: media.format,
            },
            {
                title: 'Status',
                value: media.status,
            },
            {
                title: 'Start Date',
                value: `${startDate.year}-${startDate.month}-${startDate.day}`,
            },
            {
                title: 'End Date',
                value: `${endDate.year}-${endDate.month}-${endDate.day}`,
            },
            {
                title: 'Average Score',
                value: `${media.averageScore}%`
            },
            {
                title: 'Mean Score',
                value: `${media.meanScore}%`
            },
            {
                title: 'Popularity',
                value: `${media.popularity}%`
            },
        ];
    }, []);

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

                {(media.description != null && media.description.trim().length > 0) && (
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
                )}

                <View style={styles.informationsContainer}>
                    <FlatList 
                        data={informations}
                        horizontal={true}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.information}>
                                <Text 
                                    style={styles.informationTitle}
                                    numberOfLines={1}
                                >
                                    {item.title}
                                </Text>
                                <Text 
                                    style={[styles.text, styles.informationValue]}
                                    numberOfLines={1}
                                    selectable={true}
                                >
                                    {item.value}
                                </Text>
                            </View>   
                        )}
                    />
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
    informationsContainer: {
        backgroundColor: '#151F2E',
        margin: 20,
        marginTop: 0,
        borderRadius: 5,
        //height: 70,
        flexDirection: 'row',
    },
    information: {
        height: 50,
        flexDirection: 'column',
        justifyContent: 'space-between',
        margin: 10,
        marginRight: 10,
        marginLeft: 10,
    },
    informationTitle: {
        color: 'rgb(146,153,161)',
        fontSize: 15,
    },
    informationValue: {
        fontSize: 15,
    },
});