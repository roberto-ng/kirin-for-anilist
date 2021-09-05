import React from 'react';
import MediaListScreen from '../MediaListScreen';
import { MediaType } from '../../model/anilist';

export default function AnimeTabScreen() {
    return (
        <MediaListScreen mediaType={MediaType.ANIME} />
    );
}