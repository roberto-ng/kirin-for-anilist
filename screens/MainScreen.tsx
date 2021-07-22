import React, { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import HomeTabScreen from './tabs/HomeTabScreen';
import AnimeTabScreen from './tabs/AnimeTabScreen';
import MangaTabScreen from './tabs/MangaTabScreen';

const Tab = createMaterialBottomTabNavigator();
const backgroundColor = '#151F2E';

export default function MainScreen() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            barStyle={{ backgroundColor }}
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
                            size={26} 
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
                            size={26} 
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
                            size={26} 
                        />
                    ),
                }} 
            />
        </Tab.Navigator>
    );
};
