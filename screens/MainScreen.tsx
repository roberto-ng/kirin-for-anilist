import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { TouchableWithoutFeedback } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeTabScreen from './MainScreenTabs/HomeTabScreen';
import AnimeTabScreen from './MainScreenTabs/AnimeTabScreen';
import MangaTabScreen from './MainScreenTabs/MangaTabScreen';

const Tab = createMaterialBottomTabNavigator();
const backgroundColor = '#151F2E';
const iconSize = 26;

export default function MainScreen() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            barStyle={{ backgroundColor }}
            renderTouchable={(props: any) => {
                return <TouchableWithoutFeedback 
                    {...props}
                />
            }}
        >
            <Tab.Screen 
                name="Home" 
                component={HomeTabScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons 
                            name="home" 
                            color={color} 
                            size={iconSize} 
                        />
                    ),
                }}
            />

            <Tab.Screen 
                name="Anime" 
                component={AnimeTabScreen}
                options={{
                    tabBarLabel: 'Anime',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons 
                            name="format-list-bulleted" 
                            color={color} 
                            size={iconSize} 
                        />
                    ),
                }} 
            />

            <Tab.Screen 
                name="Manga" 
                component={MangaTabScreen}
                options={{
                    tabBarLabel: 'Manga',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons 
                            name="format-list-bulleted" 
                            color={color} 
                            size={iconSize} 
                        />
                    ),
                }} 
            />
        </Tab.Navigator>
    );
};
