import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'
import React, { FC } from 'react'
import { StyleSheet, View, FlatList, ListRenderItem } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Text } from 'react-native-paper'

const DATA = [
    { title: 'IDK MAN'},
    { title: 'IDK MAN 2'},
    { title: 'BIG BATTLE'},
    { title: 'PUNCH MAN'},
    { title: 'RUN MAN' }
];

const ItemCard: FC<any> = ({ title, isLast }) => {
    return (
        <View 
            style={[styles.itemCard, { 
                marginRight: (isLast) ? 0 : 25,
            }]}
        >
            <Text style={styles.smallText}>{title}</Text>
        </View>
    );
};

const HomeTabScreen: FC = () => {
    const renderItem: ListRenderItem<any> = ({ item, index }) => {
        const isLast = index == (DATA.length - 1);

        return (
            <ItemCard title={item.title} isLast={isLast} />
        )
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { marginBottom: 10 }]}>
                This is the main screen
            </Text>

            <View style={{ height: 115, marginRight: 10, marginLeft: 10 }}>
                <FlatList
                    data={DATA}
                    renderItem={renderItem}
                    keyExtractor={item => item.title}
                    horizontal={true}
                />
            </View>

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
    itemCard: {
        backgroundColor: '#151F2E',
        height: 115,
        width: 255,
        borderRadius: 3,
        padding: 5,
    },
    smallText: {
        fontSize: 17,
        color: 'white',
    },
});

export default HomeTabScreen;