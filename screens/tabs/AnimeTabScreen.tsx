import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'
import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

export default function AnimeTabScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                This is the anime list screen
            </Text>

            <StatusBar style="light" />
        </View>
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
    fontSize: 20,
  },
});
