export type MediaStatus = 'FINISHED' | 'RELEASING' | 'NOT_YET_RELEASED' | 'CANCELLED' | 'HIATUS';
export type ActivityType = 'TEXT' | 'ANIME_LIST' | 'MANGA_LIST' | 'MESSAGE' | 'MEDIA_LIST';

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
    mediaList?: MediaList[],
    pageInfo: {
        currentPage: number,
        hasNextPage: boolean,
        lastPage: number,
        perPage: number,
        total: number,
    },
}

export interface TextActivity {
    id: number,
    userId: number,
    type: ActivityType,
    text: string,
    siteUrl: string,
    isLocked: boolean,
    isSubscribed: boolean,
    likeCount: number,
    replyCount: number,
}

export interface ListActivity {
    id: number,
    userId: number,
    type: ActivityType,
    status: string,
    progress: string,
    media: Media,
    siteUrl: string,
    isLocked: boolean,
    isSubscribed: boolean,
    likeCount: number,
    replyCount: number,
}

export interface MessageActivity {
    id: number,
    recipientId: number,
    messengerId: number,
    type: ActivityType,
    siteUrl: string,
    isLocked: boolean,
    isSubscribed: boolean,
    likeCount: number,
    replyCount: number,
}