import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ActivityUnion, Media, MediaList, User } from '../model/anilist';

export interface AnilistSlice {
    animeInProgress: MediaList[],
    mangaInProgress: MediaList[],
    activities: ActivityUnion[],
    isLoggedIn: boolean,
    token?: string,
    user?: User,
}

interface ActionEditMediaList {
    index: number;
    newMediaListItem: MediaList;
}

const initialState: AnilistSlice = {
    animeInProgress: [],
    mangaInProgress: [],
    activities: [],
    isLoggedIn: false,
    token: undefined,
};

export const anilistSlice = createSlice({
    name: 'anilist',
    initialState: initialState,
    reducers: {
        reset() {
            return initialState;
        },

        clearanimeInProgress(state) {
            state.animeInProgress = [];
        },

        clearMangaInProgress(state) {
            state.animeInProgress = [];
        },

        addToAnimeInProgressList(state, action: PayloadAction<MediaList[]>) {
            state.animeInProgress = state.animeInProgress.concat(action.payload);
        },

        addToMangaInProgressList(state, action: PayloadAction<MediaList[]>) {
            state.mangaInProgress = state.mangaInProgress.concat(action.payload);
        },

        changeMediaList(state, action: PayloadAction<ActionEditMediaList>) {
            const { index, newMediaListItem } = action.payload;
            state.animeInProgress[index] = newMediaListItem;
        },

        setActivities(state, action: PayloadAction<ActivityUnion[]>) {
            state.activities = [...action.payload];
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
    },
});