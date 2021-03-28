import 'react-native-gesture-handler'
import { StatusBar } from 'expo-status-bar'
import Constants from 'expo-constants'
import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Text } from 'react-native-paper'
import MainScreen from './screens/MainScreen'

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Main" 
                    component={MainScreen}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const backgroundColor = '#0B1622';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: backgroundColor,
    alignItems: 'center',
    //justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
  },
  text: {
    color: 'white',
  },
});
