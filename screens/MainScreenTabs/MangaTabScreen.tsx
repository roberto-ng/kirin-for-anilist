import React from 'react';
import MediaListScreen from '../MediaListScreen';
import { MediaType } from '../../model/anilist';

export default function MangaTabScreen() {
    return (
        <MediaListScreen mediaType={MediaType.MANGA} />
    );
}