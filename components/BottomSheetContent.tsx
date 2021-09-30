import React, { useState, useMemo } from 'react';
import { 
    StyleSheet, 
    View, 
    Image,
    ToastAndroid,
    Platform,
} from 'react-native';
import DropDown from 'react-native-paper-dropdown';
import InputSpinner from 'react-native-input-spinner';

import { Text, TouchableRipple } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { Media, MediaList, Character, MediaListEntryFull, MediaListStatus } from '../model/anilist';

interface Props {
    media: Media,
    initialListEntry: MediaListEntryFull,
}

export default function BottomSheetContent({ initialListEntry, media }: Props): JSX.Element {
    const [listEntry, setListEntry] = useState<MediaListEntryFull>({
        ...initialListEntry,
        status: initialListEntry.status ?? MediaListStatus.PLANNING, // set default status
    });
    const [showDropdown, setShowDropdown] = useState<boolean>(false);

    const statusList = useMemo(() => {
        return [
            { label: 'Current', value: MediaListStatus.CURRENT },
            { label: 'Planning', value: MediaListStatus.PLANNING },
            { label: 'Completed', value: MediaListStatus.COMPLETED },
            { label: 'Repeating', value: MediaListStatus.REPEATING },
            { label: 'Paused', value: MediaListStatus.PAUSED },
            { label: 'Dropped', value: MediaListStatus.DROPPED },
        ];
    }, []);

    return (
        <View style={styles.container}>
            <DropDown 
                label="Status"
                mode="outlined"
                value={listEntry.status}
                setValue={(newValue) => setListEntry({
                    ...listEntry,
                    status: newValue,
                })}
                visible={showDropdown}
                showDropDown={() => setShowDropdown(true)}
                onDismiss={() => setShowDropdown(false)}
                list={statusList}
            />

            <View style={styles.spinnersArea}>
                <View style={styles.spinnerWrapper}>
                    <Text style={styles.spinnerLabel}>
                        Progress:
                    </Text>

                    <InputSpinner
                        value={listEntry.progress}
                        onChange={(newValue: number) => {
                            setListEntry({
                                ...listEntry,
                                progress: newValue,
                            });
                        }}
                        max={media.episodes ?? undefined}
                        min={0}
                        step={1}
                        textColor="black"
                        placeholderTextColor="gray"
                        skin="clean"
                    />
                </View>

                <View style={styles.spinnerWrapper}>
                    <Text style={styles.spinnerLabel}>
                        Score:
                    </Text>

                    <InputSpinner
                        value={listEntry.score}
                        onChange={(newValue: number) => {
                            setListEntry({
                                ...listEntry,
                                score: newValue,
                            });
                        }}
                        max={10}
                        min={0}
                        step={1}
                        textColor="black"
                        placeholderTextColor="gray"
                        skin="clean"
                    />
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    spinnerWrapper: {
        width: 130,
        marginTop: 10,
        marginRight: 20,
        alignItems: 'center',
    },
    spinnerLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    spinnersArea: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
});