import 'react-native-gesture-handler';
import '@formatjs/intl-getcanonicallocales/polyfill';
import '@formatjs/intl-locale/polyfill';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/pt';
import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/pt';
import '@formatjs/intl-numberformat/polyfill';
import '@formatjs/intl-numberformat/locale-data/en';
import '@formatjs/intl-numberformat/locale-data/pt';
import '@formatjs/intl-datetimeformat/polyfill';
import '@formatjs/intl-datetimeformat/locale-data/en';
import '@formatjs/intl-datetimeformat/locale-data/pt';
import '@formatjs/intl-datetimeformat/add-all-tz';
import React, { useEffect } from 'react';
import { StyleSheet, View, Linking, NativeModules } from 'react-native';
import { Provider as PaperProvider, DarkTheme as PaperDefaultTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as ExpoLinking from 'expo-linking';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import { I18nProvider } from '@lingui/react';
import { Trans, t } from '@lingui/macro';
import { i18n } from "@lingui/core";
import { en, pt } from 'make-plural';
import MainScreen from './screens/MainScreen';
import MediaScreen from './screens/MediaScreen';
import SearchScreen from './screens/SearchScreen';
import { store, StoreState, anilistSlice } from './store/store';
import { fetchViewer, } from './api/anilist';
import { locale } from './utils';
import { messages as messagesEn } from './locales/en/messages';
import { messages as messagesPt } from './locales/pt/messages';


WebBrowser.maybeCompleteAuthSession();

i18n.loadLocaleData('en', { plurals: en });
i18n.load('en', messagesEn);
i18n.loadLocaleData('pt', { plurals: pt });
i18n.load('pt', messagesPt);
i18n.activate(locale);

const backgroundColor = '#0B1622';
const MyTheme = {
    ...DarkTheme,
    dark: true,
    colors: {
        ...DarkTheme.colors,
        background: '#0B1622',
        card: '#151F2E',
    },
};

const MyPaperTheme = {
    ...PaperDefaultTheme,
    roundness: 2,
    colors: {
        ...PaperDefaultTheme.colors,
        primary: 'white',
        accent: '#0B1622',
    },
};

const Stack = createStackNavigator();

function AppContent() {
    const dispatch = useDispatch();
    const state = useSelector((state: StoreState) => state);

    const fetchData = async (accessToken: string) => {
        const user = await fetchViewer(accessToken);        
        dispatch(anilistSlice.actions.setUser(user));
        dispatch(anilistSlice.actions.setToken(accessToken));
    };

    useEffect(() => {
        Linking.addEventListener('url', async (e) => {
            if (state.anilist.token == null) {
                try {
                    const parsedURL = ExpoLinking.parse(e.url.replace('#', '?'));
                    const accessToken = parsedURL.queryParams['access_token']
                    if (typeof accessToken !== 'string') {
                        throw new Error('Redirect URL does not contain an access_token param\n');
                    }
                
                    await AsyncStorage.setItem('anilist_token', accessToken);
                    await fetchData(accessToken);
                } catch (err) {
                    console.error(err);
                }
            }
        });

        AsyncStorage.getItem('anilist_token').then(async (accessToken) => {
            if (accessToken !== null) {
                try {
                    await fetchData(accessToken);
                } catch (err) {
                    console.error(err);
                }
            }
        });
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor }}>
            <I18nProvider i18n={i18n}>
                <PaperProvider theme={MyPaperTheme}>
                    <NavigationContainer theme={MyTheme}>
                        <Stack.Navigator 
                            initialRouteName="Main"
                        >
                            <Stack.Screen 
                                name="Main" 
                                component={MainScreen}
                                options={{
                                    headerShown: false,
                                }}
                            />
                            <Stack.Screen 
                                name="Media" 
                                component={MediaScreen}
                                options={{ 
                                    title: t`details`,
                                    headerShown: true,
                                    headerTintColor: 'white',
                                    animationEnabled: true,
                                }}
                            />
                            <Stack.Screen 
                                name="Search" 
                                component={SearchScreen}
                                options={{ 
                                    title: t`search`,
                                    headerShown: true,
                                    headerTintColor: 'white',
                                    animationEnabled: true,
                                }}
                            />
                        </Stack.Navigator>
                    </NavigationContainer>
                </PaperProvider>
            </I18nProvider>
        </View>
    );
}

export default function App() {
    return (
        <Provider store={store}>
            <AppContent />
        </Provider>
    );
}
