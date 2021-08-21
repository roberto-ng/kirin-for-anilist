import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, ActivityIndicator, Colors, } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { StoreState, anilistSlice } from '../../store/store';
import { MediaListStatus, MediaStatus } from '../../model/anilist';

interface StatusTabProps {
    status: MediaListStatus,
}

export function StatusTab({ status }: StatusTabProps): JSX.Element {
    const anilist = useSelector((state: StoreState) => state.anilist);
    const isLoading = useState<boolean>(true);

    const fetchData = async (token: string) => {
        
    };

    return (
        <View style={styles.container}>
            {(isLoading) && (
                <View style={styles.activityIndicatorContainer}>
                    <ActivityIndicator size={50} animating={true} color={Colors.white} />
                </View>
            )}

            <StatusBar style="light" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: Constants.statusBarHeight,
    },
    activityIndicatorContainer: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
});