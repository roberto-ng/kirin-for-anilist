import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Colors, List } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MediaListStatus, MediaStatus } from '../../model/anilist';
import { StoreState, anilistSlice } from '../../store/store';
import { StatusTab } from './StatusTab';

//const watchingTab = () => <View><Text>Hey!!</Text></View>;
//const rewatchingTab = () => <StatusTab status={MediaListStatus.REPEATING} />;
//const completedTab = () => <StatusTab status={MediaListStatus.COMPLETED} />;

export default function AnimeTabScreen(): JSX.Element {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <View style={styles.container}>
            <List.Section title="">
                <List.Accordion
                    title="Accordion"
                    style={styles.accordion}
                >
                    <Text>First item</Text>
                    <Text>Second item</Text>
                </List.Accordion>

                <List.Accordion
                    title="Another Accordion"
                    style={styles.accordion}
                >
                    <Text>First item</Text>
                    <Text>Second item</Text>
                </List.Accordion>
            </List.Section>

            {(isLoading) && (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator size={50} animating={true} color={Colors.white} />
                </View>
            )}

            <StatusBar style="light" />
        </View>
    );
}

const backgroundColor = '#0B1622';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: backgroundColor,
        alignItems: 'stretch',
        //justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
    },
    text: {
        color: 'white',
        fontSize: 20,
    },
    activityIndicatorContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    accordion: {
        backgroundColor: '#151F2E',
    },
});
