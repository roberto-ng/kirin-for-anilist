import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { anilistSlice, AnilistSlice } from './anilistSlice';
export { anilistSlice, AnilistSlice } from './anilistSlice';

export interface StoreState {
    anilist: AnilistSlice,
}

export const store = configureStore({
    reducer: combineReducers({
        anilist: anilistSlice.reducer,
    }),
});