import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, RadioButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { fetchMediaWithTitle } from '../api/anilist';
import { MediaType } from '../model/anilist';
import { StoreState } from '../store/store';

export default function SearchScreen() {
    const anilist = useSelector((state: StoreState) => state.anilist); 
    const [mediaType, setMediaType] = useState<MediaType>(MediaType.ANIME);
    
    const handleSearch = async () => {
        const title = 'naruto';

        try {
            const medias = await fetchMediaWithTitle(title, mediaType);
            for (const media of medias) {
                console.log(media.title.romaji);
            }
        } catch(e) {
            console.error(e);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                
                <View style={{ alignItems: 'center' }}>
                    <View style={{ width: 300, height: 120, top: 30 }}>
                        <TextInput
                            label="Title"
                            style={styles.textInput}
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
        </View>
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
        //flex: 1,
        //marginBottom: 10,
        backgroundColor: '#174a97',
        //height: 100,
        //maxWidth: 250,
    },
    searchButton: {
        width: 200,
    },
});