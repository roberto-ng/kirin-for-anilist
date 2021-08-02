export type MediaStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';

export interface Media {
    id: string,
    episodes: number,
    status: MediaStatus,
    title: {
        romaji: string,
        english: string,
        native: string,
    },
    coverImage: {
        medium: string,
    },
}

export interface MediaList {
    progress: number,
    updatedAt: number,
    media: Media,
}

export interface User {
    id: string,
    name: string,
}

export interface Page {
    mediaList: MediaList[],
    pageInfo: {
        currentPage: number,
        hasNextPage: boolean,
        lastPage: number,
        perPage: number,
        total: number,
    },
}