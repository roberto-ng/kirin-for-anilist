import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'
import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'
import { Text } from 'react-native-paper'

const MangaTabScreen: FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                This is the manga list screen
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

export default MangaTabScreen;