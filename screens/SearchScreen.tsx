import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { TextInput, Button, RadioButton, Text } from 'react-native-paper';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';
import { useSelector } from 'react-redux';
import { fetchMediaWithTitle } from '../api/anilist';
import { MediaType, Media } from '../model/anilist';
import { StoreState } from '../store/store';

export default function SearchScreen() {
    const anilist = useSelector((state: StoreState) => state.anilist); 
    const [mediaType, setMediaType] = useState<MediaType>(MediaType.ANIME);
    const [result, setResult] = useState<Media[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    
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

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                <View style={{ alignItems: 'center' }}>
                    <View style={{ width: 300, height: 120, top: 30 }}>
                        <TextInput
                            label="Title"
                            style={styles.textInput}
                            value={searchQuery}
                            onChangeText={value => setSearchQuery(value)}
                        />
                    </View>
                    
                    <View style={{ bottom: 12 }}>
                        <RadioButton.Group 
                            onValueChange={value => setMediaType(value as MediaType)} value={mediaType}
                        >
                            <RadioButton.Item label="Anime" value={MediaType.ANIME} color="white" />
                            <RadioButton.Item label="Manga" value={MediaType.MANGA} color="white" />
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
                        Results: 
                    </Text>
                )}

                {result.map(media => (
                    <View 
                        key={media.id}
                        style={styles.itemCard}
                    >
                        <TouchableWithoutFeedback 
                            style={styles.cardCoverImage}
                            //onPress={openMediaPage}
                        >
                            <ImageBackground
                                style={styles.cardCoverImage} 
                                source={{ uri: media.coverImage.large }} 
                            />
                        </TouchableWithoutFeedback>

                        <Text style={styles.text} numberOfLines={1}>
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