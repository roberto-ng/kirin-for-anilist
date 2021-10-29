import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { TextInput, Button, RadioButton, Text, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { fetchMediaWithTitle } from '../api/anilist';
import { MediaType, Media } from '../model/anilist';
import { StoreState } from '../store/store';
import { Trans } from '@lingui/macro';

export default function SearchScreen() {
    const anilist = useSelector((state: StoreState) => state.anilist); 
    const navigation = useNavigation();
    const [mediaType, setMediaType] = useState<MediaType>(MediaType.ANIME);
    const [result, setResult] = useState<Media[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const onChangeSearch = (query: string) => setSearchQuery(query);
    
    const handleSearch = async () => {
        if (searchQuery.trim().length === 0) {
            // do nothing if the query is empty
            setResult([]);
            return;
        }

        try {
            const medias = await fetchMediaWithTitle(searchQuery, mediaType);
            setResult(medias);
        } catch(e) {
            console.error(e);
        }
    };

    const openMediaPage = (media: Media) => {
        //@ts-ignore
        navigation.navigate('Media', {
            media: media,
            title: media.title.romaji,
        });
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <View style={{ alignItems: 'center' }}>
                    <Searchbar
                        placeholder="Search"
                        onChangeText={onChangeSearch}
                        value={searchQuery}
                        style={{ backgroundColor: '#174a97' }}
                    />
                    
                    <View>
                        <RadioButton.Group 
                            onValueChange={value => setMediaType(value as MediaType)} 
                            value={mediaType}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <RadioButton.Item 
                                    label="Anime" 
                                    value={MediaType.ANIME} 
                                    color="white" 
                                />
                                <RadioButton.Item 
                                    label="Manga" 
                                    value={MediaType.MANGA} 
                                    color="white" 
                                />
                            </View>
                        </RadioButton.Group>
                    </View>

                    <Button
                        onPress={handleSearch}
                        mode="contained"
                        color="#174a97"
                        style={styles.searchButton}
                    >
                        Search
                    </Button>
                </View>
            </View>

            <View style={styles.resultsContainer}>
                {(result.length > 0) && (
                    <Text style={{ fontSize: 19 }}>
                        <Trans id="results.label">
                            Results: 
                        </Trans>
                    </Text>
                )}

                {result.map(media => (
                    <View 
                        key={media.id}
                        style={styles.itemCard}
                    >
                        <TouchableWithoutFeedback 
                            style={styles.cardCoverImage}
                            onPress={() => openMediaPage(media)}
                        >
                            <ImageBackground
                                style={styles.cardCoverImage} 
                                source={{ uri: media.coverImage.large }} 
                            />
                        </TouchableWithoutFeedback>

                        <Text 
                            style={styles.text} 
                            numberOfLines={3}
                            onPress={() => openMediaPage(media)}
                        >
                            {media.title.romaji}
                        </Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        padding: 10,
        width: '100%',
        justifyContent: 'center',
    },
    textInput: {
        backgroundColor: '#174a97',    
    },
    searchButton: {
        width: 200,
    },
    itemCard: {
        backgroundColor: '#151F2E',
        height: 115,
        width: 305,
        borderRadius: 3,
        flexDirection: 'row',
        margin: 5,
    },
    cardCoverImage: {
        height: 115,
        width: 85,
    },
    resultsContainer: {
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        margin: 5,
        maxWidth: 210,
    },
});