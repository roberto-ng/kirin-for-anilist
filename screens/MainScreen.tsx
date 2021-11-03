import React, { FC, useEffect} from 'react';
import { StyleSheet, View } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { TouchableWithoutFeedback } from 'react-native';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/core';
import HomeTabScreen from './MainScreenTabs/HomeTabScreen';
import AnimeTabScreen from './MainScreenTabs/AnimeTabScreen';
import MangaTabScreen from './MainScreenTabs/MangaTabScreen';
import { StoreState } from '../store/store';

const Tab = createMaterialBottomTabNavigator();
const backgroundColor = '#151F2E';
const iconSize = 26;

export default function MainScreen() {
    const anilist = useSelector((state: StoreState) => state.anilist);
    const navigation = useNavigation();
    
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
