import Constants from 'expo-constants'
import { StatusBar } from 'expo-status-bar'
import React, { FC } from 'react'
import { 
    StyleSheet, 
    View, 
    FlatList, 
    ListRenderItem, 
    Image 
} from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Text } from 'react-native-paper'

const DATA = [
    { title: 'IDK MAN'},
    { title: 'IDK MAN 2'},
    { title: 'BIG BATTLE'},
    { title: 'PUNCH MAN'},
    { title: 'RUN MAN' },
];

const ItemCard: FC<any> = ({ title, isLast }) => {
    return (
        <View 
            style={[styles.itemCard, { 
                marginRight: (isLast) ? 0 : 25,
            }]}
        >
            <Image 
                style={styles.cardCoverImage} 
                source={{
                    uri: 'https://s4.anilist.co/file/anilistcdn/media/anime/cover/medium/bx124845-7dRs0HgkFWgk.jpg'
                }} 
            />

            <View style={styles.cardContent}>
                <Text style={[styles.cardContentText, styles.cardContentTitle]}>
                    {title}
                </Text>
            
                <View style={styles.cardContentInfo}>
                    <Text style={[styles.cardContentText, styles.cardContentInfoText]}>
                        Progress: 0/0 +
                    </Text>
                </View>
            </View>

        </View>
    );
};

const HomeTabScreen: FC = () => {
    const renderItem: ListRenderItem<any> = ({ item, index }) => {
        // check if this is the last item on the list
        const isLast = index == (DATA.length - 1);

        return (
            <ItemCard title={item.title} isLast={isLast} />
        )
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.text, { marginBottom: 10, marginLeft: 15 }]}>
                Airing
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
        alignItems: 'flex-start',
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
        flexDirection: 'row',
    },
    cardCoverImage: {
        height: 115,
        width: 85,
    },
    cardContent: {
        flex: 1,
        padding: 12,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    cardContentText: {
        color: 'rgb(159,173,189)',
    },
    cardContentTitle: {
        fontSize: 17,
    },
    cardContentInfo: {
        marginBottom: 1,
    },
    cardContentInfoText: {
        fontSize: 15,
    },
});

export default HomeTabScreen;