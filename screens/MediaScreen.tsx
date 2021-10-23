import 'ts-replace-all';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { 
    View, 
    ScrollView, 
    StyleSheet, 
    Image, 
    ImageBackground, 
    Platform,
    ToastAndroid, 
    FlatList,
} from 'react-native';
import  BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Paragraph, Text, Colors, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import { Shadow } from 'react-native-shadow-2';
import * as Clipboard from 'expo-clipboard';
import { useSelector } from 'react-redux';
import { Media, MediaList, Character, MediaListEntryFull, MediaListStatus } from '../model/anilist';
import { fetchMediaCharacters, fetchMediaListEntry } from '../api/anilist';
import CharacterCard from '../components/CharacterCard';
import BottomSheetContent from '../components/BottomSheetContent';
import { StoreState } from '../store/store';

interface Props {
    route: {
        params: {
            media: Media,
        },
    },
}

interface Information {
    title: string,
    value: string | null,
}

export default function MediaScreen({ route }: Props): JSX.Element {
    const anilist = useSelector((state: StoreState) => state.anilist); 
    const [characters, setCharacters] = useState<Character[]>([]);
    const [errorLoadingCharacters, setErrorLoadingCharacters] = useState<boolean>(false);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [listEntry, setListEntry] = useState<MediaListEntryFull | null>(null);
    const [hasLoadedListEntry, setHasLoadedListEntry] = useState<boolean>(false);
    const [status, setStatus] = useState<MediaListStatus | null>(null);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['30%', '60%', '90%', '100%'], []);
    
    const { media } = route.params;
    const title = media.title.romaji;

    const informations = useMemo((): Information[] => {
        const { startDate, endDate } = media;
        const dateTimeFormat = new Intl.DateTimeFormat('en', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });

        let startDateText = null;
        let endDateText = null;
        if (startDate?.day != null && startDate?.month != null && startDate?.year != null) {
            const date = new Date(
                startDate.year, 
                startDate.month - 1, // january is month 0, december is month 11
                startDate.day,
            );
            
            startDateText = dateTimeFormat.format(date);
        }
        if (endDate?.day != null && endDate?.month != null && endDate?.year != null) {
            const date = new Date(
                endDate.year, 
                endDate.month - 1, // january is month 0, december is month 11
                endDate.day,
            );

            endDateText = dateTimeFormat.format(date);
        }

        const infos = [
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
                value: startDateText,
            },
            {
                title: 'End Date',
                value: endDateText,
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
                value: `${media.popularity}`
            },
        ];

        // remove items with a null value
        return infos.filter(info => info.value != null);
    }, []);


    const formatDescription = (description: string): string => {
        return description
            .replaceAll('<br>', '')
            .replaceAll('</br>', '')
            .replaceAll('<b>', '')
            .replaceAll('</b>', '')
            .replaceAll('<i>', '')
            .replaceAll('</i>', '');
    };

    const handleTitleLongPress = () => {
        Clipboard.setString(title);

        if (Platform.OS === 'android') {
            ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
        }
    };

    const handleEditButtonPress = () => {
        bottomSheetRef.current?.snapToIndex(2);
    };

    const onCloseBottomSheet = () => {
        bottomSheetRef.current?.close();
    };

    useEffect(() => {
        let unmounted = false;

        fetchMediaCharacters(media.id)
            .then((newCharacters) => {
                if (!unmounted) {
                    setCharacters(newCharacters);
                }
            })
            .catch(err => {
                if (!unmounted) {
                    setErrorLoadingCharacters(true);
                    
                    if (Platform.OS === 'android') {
                        ToastAndroid.show(err?.message ?? err, ToastAndroid.SHORT);
                    }
                    
                    console.error(err.message);
                }
            });
        
        
        if (anilist.token != null) {
            setIsLoggedIn(true);

            fetchMediaListEntry(anilist.token, media.id)
                .then((entry) => {
                    if (!unmounted) {
                        setListEntry(entry);
                        setHasLoadedListEntry(true);
                        setStatus(entry?.status ?? null);
                    }
                })
                .catch((err) => {
                    if (!unmounted) {
                        if (Platform.OS === 'android') {
                            ToastAndroid.show(err.message, ToastAndroid.SHORT);
                        }
    
                        console.log(err.message);
                    }
                });
        }

        return () => { unmounted = true };
    }, []);

    return (
        <>
            <ScrollView style={styles.container}>
                <ImageBackground
                    style={styles.banner}
                    source={{ uri: media.bannerImage }}
                >
                    <View style={styles.bannerWrapper}>
                        <View style={styles.coverAndButtonWrapper}>
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
                    </View>
                </ImageBackground>
                
                <View style={styles.buttonWrapper}>
                    {(hasLoadedListEntry) ? (
                        <Button 
                            mode="contained"
                            onPress={handleEditButtonPress}
                            color="#174a97"
                            style={{ flex: 1, marginTop: 12, margin: 10, marginBottom: 0 }}
                        >
                            {(listEntry == null) ? 'Add' : 'Edit'}
                        </Button>
                    ) : (
                        <View style={{ flex: 1, marginTop: 12, margin: 10, marginBottom: 0 }}>
                            <ActivityIndicator 
                                animating={true}
                            />
                        </View>
                    )}  
                </View>

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

                    {(characters.length > 0) && (
                        <View style={styles.charactersContainer}>
                            <Text style={[styles.sectionTitle, styles.text]}>
                                Characters:
                            </Text>

                            <FlatList 
                                data={characters}
                                horizontal={true}
                                keyExtractor={(_, i) => i.toString()}
                                renderItem={({ item }) => (
                                    <CharacterCard 
                                        character={item}
                                    />
                                )}
                            />
                        </View>
                    )}
                </View>
            </ScrollView>

            <BottomSheet
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                index={-1}
                backgroundComponent={() => (
                    <View style={styles.bottomSheetBackground} />
                )}
                handleComponent={() => (
                    <View style={styles.closeLineContainer}>
                        <View style={styles.closeLine}></View>
                    </View>
                )}
            >
                <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContainer}>
                    <View style={styles.closeButtonWrapper}>
                        <IconButton 
                            size={27}
                            icon="close-thick"
                            onPress={onCloseBottomSheet}
                        />
                    </View>
                    
                    {(hasLoadedListEntry) && (
                        <BottomSheetContent 
                            media={media}
                            initialListEntry={listEntry}
                            token={anilist.token}
                            onSaveFinished={(updatedListEntry) => {
                                setListEntry(updatedListEntry);
                                onCloseBottomSheet();
                            }}
                        />
                    )}
                </BottomSheetScrollView>
            </BottomSheet>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //marginBottom: 10,
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
        top: 0,
        marginBottom: 10,
    },
    title: {
        fontSize: 20,
        //marginTop: 30,
        marginLeft: 20,
        marginRight: 20,
    },
    sectionTitle: {
        fontSize: 20,
        marginTop: 5,
        marginBottom: 5,
    },
    coverAndButtonWrapper: {
        height: 230,
        flexDirection: 'row',
        //justifyContent: 'space-between',
        marginRight: 20,
        alignItems: 'flex-end',
    },
    buttonWrapper: {
        //marginTop: 230 - 37,
        //flex: 1,
        flexDirection: 'row',
        //alignItems: 'flex-start',
        //margin: 10,
        marginLeft: 190,
        marginBottom: 20,
        height: 48,
    },
    text: {
        color: 'rgb(159,173,189)',
    },
    descriptionContainer: {
        backgroundColor: '#151F2E',
        margin: 20,
        marginTop: 10,
        marginBottom: 0,
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
        marginRight: 20,
        marginLeft: 20,
        marginTop: 10,
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
    charactersContainer: {
        marginLeft: 20,
        marginRight: 20,
    },
    bottomSheetContainer: {
        flex: 1, 
        //width: '100%',
        marginRight: 10,
        marginLeft: 10,
    },
    bottomSheetBackground: {
        ...StyleSheet.absoluteFillObject,
        //backgroundColor: '#15181c',
        backgroundColor: '#151f2e',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    closeLineContainer: {
        alignSelf: 'center'
    },
    closeLine: {
        width: 40,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.white,
        marginTop: 9,
    },
    closeButtonWrapper: {
        width: '100%',
        alignItems: 'flex-end',
    },
});