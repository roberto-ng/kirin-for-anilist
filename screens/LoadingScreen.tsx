import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as ExpoLinking from 'expo-linking';
import Constants from 'expo-constants';
import { Trans } from '@lingui/macro';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/core';
import { fetchViewer } from '../api/anilist';
import { ActivityIndicator, Colors, Button } from 'react-native-paper';
import { anilistSlice, StoreState } from '../store/store';

const authUrl = `https://anilist.co/api/v2/oauth/authorize`;
const clientId: string = Constants.manifest?.extra?.anilistClientId;

export default function LoadingScreen({ navigation }: any) {
    const dispatch = useDispatch();
    const state = useSelector((state: StoreState) => state);

    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setisLoggedIn] = useState(false);

    const openHomeScreen = () => {
        // @ts-ignore
        navigation.navigate('Main');
        setisLoggedIn(true);
    };

    const logOut = async () => {
        await AsyncStorage.removeItem('anilist_token');
        dispatch(anilistSlice.actions.setUser(undefined));
        dispatch(anilistSlice.actions.setToken(undefined));
        dispatch(anilistSlice.actions.setIsLoggedIn(false));
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
                    openHomeScreen();
                } catch (err) {
                    await logOut();
                    console.error(err);
                }
            } else {
                await logOut();
            }

            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        if (isLoggedIn && (state.anilist.token == null || state.anilist.user == null)) {
            // reset component
            setIsLoading(false);
            setisLoggedIn(false);
        }
    });

    if (!isLoading && !isLoggedIn && (state.anilist.token == null || state.anilist.user == null)) {
        return (
            <View style={styles.container}>
                <Button 
                    mode="contained"
                    onPress={handleLogInBtnPress}
                    color="#174a97"
                >
                    <Trans>login</Trans>
                </Button>

                <StatusBar style="light" />
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
            <StatusBar style="light" />
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