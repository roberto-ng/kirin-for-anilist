import React, { useState, useMemo, useEffect } from 'react';
import { 
    StyleSheet, 
    View, 
    Image,
    ToastAndroid,
    Platform,
} from 'react-native';
import DropDown from 'react-native-paper-dropdown';
import InputSpinner from 'react-native-input-spinner';
import { Text, Button, DefaultTheme, DarkTheme } from 'react-native-paper';
import { Media, MediaListEntryFull, MediaListStatus, FuzzyDate } from '../model/anilist';

interface Props {
    media: Media,
    initialListEntry: MediaListEntryFull,
}

const MyPaperTheme = {
    ...DarkTheme,
    roundness: 2,
    colors: {
        ...DarkTheme.colors,
        background: '#151F2E',
    },
};

export default function BottomSheetContent({ initialListEntry, media }: Props): JSX.Element {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date | null>(fuzzyDateToJsDate(initialListEntry.startedAt));
    const [startDateText, setStartDateText] = useState<string>('');
    const [listEntry, setListEntry] = useState<MediaListEntryFull>({
        ...initialListEntry,
        status: initialListEntry.status ?? MediaListStatus.PLANNING, // set default status
    });

    const dateTimeFormat = useMemo(() => {
        return new Intl.DateTimeFormat('en', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    }, []);

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

    useEffect(() => {
        if (startDate == null) {
            setStartDateText('Unknown date');

            const newListEntry: MediaListEntryFull = { 
                ...listEntry,
                startedAt: undefined,
            };
            setListEntry(newListEntry);
        } else {
            const text = dateTimeFormat.format(startDate);
            setStartDateText(text);

            const newListEntry: MediaListEntryFull = { 
                ...listEntry,
                startedAt: {
                    day: startDate.getDay(),
                    month: startDate.getMonth() + 1,
                    year: startDate.getFullYear(),
                },
            };
            setListEntry(newListEntry);
        }
    }, [startDate]);

    return (
        <View style={styles.container}>
            <View style={styles.spinnersArea}>
                <View style={[styles.spinnerWrapper, { marginRight: 30 }]}>
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
                        max={media.episodes ?? media.chapters}
                        min={0}
                        step={1}
                        textColor="black"
                        placeholderTextColor="gray"
                        skin="round"
                        color="#03A9F4"
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
                        skin="round"
                        color="#03A9F4"
                    />
                </View>
            </View>

            <View style={styles.dropDownWrapper}>
                <DropDown 
                    label="Status"
                    mode="flat"
                    value={listEntry.status}
                    setValue={(newValue) => setListEntry({
                        ...listEntry,
                        status: newValue,
                    })}
                    visible={showDropdown}
                    showDropDown={() => setShowDropdown(true)}
                    onDismiss={() => setShowDropdown(false)}
                    list={statusList}
                    theme={MyPaperTheme}
                    //dropDownItemStyle={{ backgroundColor: 'white' }}
                    //dropDownItemSelectedStyle={{ backgroundColor: 'white' }}
                />
            </View>

            <View style={styles.dateWrapper}>
                <Text style={styles.dateLabel}>
                    Started at:
                </Text>
                <View style={styles.dateBottom}>
                    <Text style={styles.dateText}>
                        {startDateText}
                    </Text>

                    <Button
                        mode="contained"
                        color="#03A9F4"
                        onPress={() => {}}
                        style={styles.dateEditButton}
                        compact
                    >
                        Edit
                    </Button>

                    {(listEntry?.startedAt?.day != null) && (
                        <Button
                            mode="contained"
                            color="#03A9F4"
                            onPress={() => {}}
                            compact
                        >
                            Clear
                        </Button>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    spinnerWrapper: {
        width: 130,
        marginBottom: 10,
        //marginRight: 20,
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
    dropDownWrapper: {
        //backgroundColor: 'white',
    },
    dateWrapper: {
        alignItems: 'center',
        marginTop: 10,
    },
    dateLabel: {
        fontSize: 16,
    },
    dateText: {
        fontSize: 18,
    },
    dateEditButton: {
        marginRight: 10,
        marginLeft: 10,
    },
    dateBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
});

const fuzzyDateToJsDate = (fuzzyDate: FuzzyDate | undefined): (Date | null) => {
    if (fuzzyDate == null) {
        return null;
    }

    const {year, month, day} = fuzzyDate;
    if (year != null && month != null && day != null)  {
        return new Date(
            year,
            month - 1,
            day,
        );
    } else {
        return null;
    }
}