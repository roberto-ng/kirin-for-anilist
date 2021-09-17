import React, { memo } from 'react';
import { 
    StyleSheet, 
    View, 
    Image,
    ToastAndroid,
    Platform,
} from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { Character } from '../model/anilist';

interface Props {
    character: Character,
}

function CharacterCard({ character }: Props): JSX.Element {
    const name = character.name.full;

    const handleNameLongPress = () => {
        Clipboard.setString(name);

        if (Platform.OS === 'android') {
            ToastAndroid.show('Copied to clipboard', ToastAndroid.SHORT);
        }
    };

    return (
        <View style={styles.container}>
            <Image 
                style={styles.coverImage} 
                source={{ uri: character.image.medium }} 
            />

            <Text 
                numberOfLines={1}
                style={styles.text}
                onLongPress={handleNameLongPress}
            >
                {name}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 255,
        height: 115,
        borderRadius: 3,
        flexDirection: 'row',
        backgroundColor: '#151F2E',
        margin: 5,
    },
    coverImage: {
        height: 115,
        width: 85,
    },
    text: {
        color: 'rgb(159,173,189)',
        fontSize: 16,
        margin: 12,
        maxWidth: '60%',
    },
});

export default memo(CharacterCard);