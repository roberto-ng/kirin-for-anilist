import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants';
import React, { useEffect } from 'react';
import { StyleSheet, View, Linking } from 'react-native';
import { Provider as PaperProvider, DarkTheme as PaperDefaultTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as WebBrowser from 'expo-web-browser';
import * as ExpoLinking from 'expo-linking';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import MainScreen from './screens/MainScreen';
import { store, StoreState, anilistSlice } from './store/store';
import { 
    fetchViewer, 
} from './api/anilist';

WebBrowser.maybeCompleteAuthSession();

const backgroundColor = '#0B1622';
const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#0B1622'
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
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
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