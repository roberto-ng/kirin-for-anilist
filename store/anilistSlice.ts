import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActivityUnion, Media, MediaList, User } from '../model/anilist';

export interface AnilistSlice {
    isLoggedIn: boolean,
    token?: string,
    user?: User,
    shouldMediaListScreenUpdate: boolean,
    shouldHomeScreenUpdate: boolean,
}

interface ActionEditMediaList {
    index: number;
    newMediaListItem: MediaList;
}

const initialState: AnilistSlice = {
    isLoggedIn: false,
    token: undefined,
    user: undefined,
    shouldHomeScreenUpdate: false,
    shouldMediaListScreenUpdate: false,
};

export const anilistSlice = createSlice({
    name: 'anilist',
    initialState: initialState,
    reducers: {
        reset() {
            return initialState;
        },

        setIsLoggedIn(state, action: PayloadAction<boolean>) {
            state.isLoggedIn = action.payload;
        },

        setToken(state, action: PayloadAction<string | undefined>) {
            state.token = action.payload;
        },

        setUser(state, action: PayloadAction<User | undefined>) {
            state.user = action.payload;
        },

        setShouldHomeScreenUpdate(state, action: PayloadAction<boolean>) {
            state.shouldHomeScreenUpdate = action.payload;
        },

        setShouldMediaListScreenUpdate(state, action: PayloadAction<boolean>) {
            state.shouldMediaListScreenUpdate = action.payload;
        },
    },
});