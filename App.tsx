import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Text } from 'react-native-paper'
import MainScreen from './screens/MainScreen'

const backgroundColor = '#0B1622';
const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#0B1622'
    },
};

const Stack = createStackNavigator();

export default function App() {
    return (
        <View style={{ flex: 1, backgroundColor }}>
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
        </View>
    );
}