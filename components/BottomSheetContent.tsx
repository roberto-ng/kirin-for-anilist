import React, { useState, useMemo, useEffect } from 'react';
import { 
    StyleSheet, 
    View, 
    Image,
    ToastAndroid,
    Platform,
    ScrollView,
} from 'react-native';
import DropDown from 'react-native-paper-dropdown';
import InputSpinner from 'react-native-input-spinner';
import { Text, Button, DefaultTheme, DarkTheme, IconButton, } from 'react-native-paper';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
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
        background: '#174a97',
    },
};

const blue = '#1565C0';

export default function BottomSheetContent({ initialListEntry, media }: Props): JSX.Element {
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [startDate, setStartDate] = useState<Date | null>(fuzzyDateToJsDate(initialListEntry.startedAt));
    const [finishDate, setFinishDate] = useState<Date | null>(fuzzyDateToJsDate(initialListEntry.completedAt));
    const [startDateText, setStartDateText] = useState<string>('');
    const [finishDateText, setFinishDateText] = useState<string>('');
    const [showStartDatePicker, setShowStartDatePicker] = useState<boolean>(false);
    const [showFinishDatePicker, setShowFinishDatePicker] = useState<boolean>(false);
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

    const onStartDateChange = (_event: Event, selectedDate: Date | undefined) => {
        const newDate = selectedDate ?? startDate;
        setStartDate(newDate);
        setShowStartDatePicker(false);
    }

    const onFinishDateChange = (_event: Event, selectedDate: Date | undefined) => {
        const newDate = selectedDate ?? finishDate;
        setFinishDate(newDate);
        setShowFinishDatePicker(false);
    }

    const removeStartDate = () => {
        setStartDate(null);
    };

    const removeFinishDate = () => {
        setFinishDate(null);
    }

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

    useEffect(() => {
        if (finishDate == null) {
            setFinishDateText('Unknown date');

            const newListEntry: MediaListEntryFull = { 
                ...listEntry,
                completedAt: undefined,
            };
            setListEntry(newListEntry);
        } else {
            const text = dateTimeFormat.format(finishDate);
            setFinishDateText(text);

            const newListEntry: MediaListEntryFull = { 
                ...listEntry,
                completedAt: {
                    day: finishDate.getDay(),
                    month: finishDate.getMonth() + 1,
                    year: finishDate.getFullYear(),
                },
            };
            setListEntry(newListEntry);
        }
    }, [finishDate]);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.spinnersArea}>
                <View style={[styles.spinnerWrapper, { marginRight: 10 }]}>
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
                        color={blue}
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
                        color={blue}
                    />
                </View>
            </View>

            <View style={{ alignItems: 'center', }}>
                <View style={styles.dropDownWrapper}>
                    <Text style={styles.dateLabel}>
                        Status:
                    </Text>
                    <DropDown 
                        //label="Status"
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
            </View>

            <View style={{ margin: 10, alignItems: 'center',  }}>
                <View>
                    <Text style={styles.dateLabel}>
                        Start date:
                    </Text>

                    <View style={{ alignItems: 'center', flexDirection: 'row', width: 200 }}>
                        <Button 
                            mode="contained"
                            icon="calendar-month"
                            color={blue}
                            style={{ width: 200 }}
                            onPress={() => setShowStartDatePicker(true)}
                        >
                            {startDateText}
                        </Button>

                        {(startDate) && (
                            <IconButton
                                icon="close"
                                size={20}
                                onPress={removeStartDate}
                            />
                        )}
                    </View>
                </View>
            </View>

            <View style={{ alignItems: 'center' }}>
                <View>
                    <Text style={styles.dateLabel}>
                        Finish date:
                    </Text>

                    <View style={{ alignItems: 'center', flexDirection: 'row', width: 200 }}>
                        <Button 
                            mode="contained"
                            icon="calendar-month"
                            color={blue}
                            style={{ width: 200 }}
                            onPress={() => setShowFinishDatePicker(true)}
                        >
                            {finishDateText}
                        </Button>

                        {(finishDate) && (
                            <IconButton
                                icon="close"
                                size={20}
                                onPress={removeFinishDate}
                            />
                        )}
                        
                    </View>
                </View>
            </View>

            {(showStartDatePicker) && (    
                <DateTimePicker
                    testID="dateTimePicker"
                    value={startDate ?? new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    themeVariant="dark"
                    onChange={onStartDateChange}
                />
            )}

            {(showFinishDatePicker) && (    
                <DateTimePicker
                    testID="finishDateTimePicker"
                    value={finishDate ?? new Date()}
                    mode="date"
                    is24Hour={true}
                    display="default"
                    themeVariant="dark"
                    onChange={onFinishDateChange}
                />
            )}  
        </ScrollView>
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
        width: 200,
    },
    dateWrapper: {
        alignItems: 'center',
        marginTop: 10,
    },
    dateLabel: {
        fontSize: 16,
        marginBottom: 8,
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