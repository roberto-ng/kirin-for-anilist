import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import ExpoLinking from 'expo-linking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { fetchViewer } from '../api/anilist';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { anilistSlice, StoreState } from '../store/store';

export default function LoadingScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const state = useSelector((state: StoreState) => state);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [wasOpenViaURL, setWasOpenViaURL] = useState(false);

    const openHomeScreen = () => {
        // @ts-ignore
        navigation.navigate('Main');
    };

    const fetchData = async (accessToken: string) => {
        const user = await fetchViewer(accessToken);        
        dispatch(anilistSlice.actions.setUser(user));
        dispatch(anilistSlice.actions.setToken(accessToken));
    };

    useEffect(() => {
        Linking.addEventListener('url', async (e) => {
            setWasOpenViaURL(true);

            if (state.anilist.token == null) {
                try {
                    const parsedURL = ExpoLinking.parse(e.url.replace('#', '?'));
                    const accessToken = parsedURL.queryParams['access_token']
                    if (typeof accessToken !== 'string') {
                        throw new Error('Redirect URL does not contain an access_token param\n');
                    }
                
                    await AsyncStorage.setItem('anilist_token', accessToken);
                    await fetchData(accessToken);
                    setisLoggedIn(true);
                    openHomeScreen();
                } catch (err) {
                    console.error(err);
                }

                setIsLoading(false);
            }
        });

        AsyncStorage.getItem('anilist_token').then(async (accessToken) => {
            if (accessToken !== null) {
                try {
                    await fetchData(accessToken);
                    setisLoggedIn(true);
                    openHomeScreen();
                } catch (err) {
                    setisLoggedIn(false);
                    console.error(err);
                }
            } else {
                setisLoggedIn(false);
            }

            setIsLoading(false);
        });
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator 
                size={50} 
                animating={true} 
                color={Colors.white} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});