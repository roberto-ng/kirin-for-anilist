import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import ExpoLinking from 'expo-linking';
import Constants from 'expo-constants';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { fetchViewer } from '../api/anilist';
import { ActivityIndicator, Colors, Button } from 'react-native-paper';
import { anilistSlice, StoreState } from '../store/store';

const authUrl = `https://anilist.co/api/v2/oauth/authorize`;
const clientId: string = Constants.manifest?.extra?.anilistClientId;

export default function LoadingScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const state = useSelector((state: StoreState) => state);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setisLoggedIn] = useState(false);

    const openHomeScreen = () => {
        // @ts-ignore
        navigation.navigate('Main');
    };

    const logOut = async () => {
        await AsyncStorage.removeItem('anilist_token');
        dispatch(anilistSlice.actions.setUser(undefined));
        dispatch(anilistSlice.actions.setToken(undefined));
    };

    const fetchData = async (accessToken: string) => {
        const user = await fetchViewer(accessToken);        
        dispatch(anilistSlice.actions.setUser(user));
        dispatch(anilistSlice.actions.setToken(accessToken));
    };

    const handleLogInBtnPress = () => {
        Linking.openURL(authUrl + '?client_id=' + clientId + '&response_type=token');
    };

    useEffect(() => {
        Linking.addEventListener('url', async (e) => {
            if (state.anilist.token == null) {
                try {
                    setIsLoading(true);
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
                    await logOut();
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
                    await logOut();
                    setisLoggedIn(false);
                    console.error(err);
                }
            } else {
                await logOut();
                setisLoggedIn(false);
            }

            setIsLoading(false);
        });
    }, []);

    if (!isLoading && !isLoggedIn) {
        return (
            <View style={styles.container}>
                <Button 
                    mode="contained"
                    onPress={handleLogInBtnPress}
                    color="#174a97"
                >
                    Log in
                </Button>
            </View>
        );
    }


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