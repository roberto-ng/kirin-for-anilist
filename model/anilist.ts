export enum MediaStatus {
    FINISHED = 'FINISHED',
    RELEASING = 'RELEASING',
    NOT_YET_RELEASED = 'NOT_YET_RELEASED',
    CANCELLED = 'CANCELLED',
    HIATUS = 'HIATUS',
} 

export enum ActivityType {
    TEXT = 'TEXT',
    ANIME_LIST = 'ANIME_LIST',
    MANGA_LIST = 'MANGA_LIST',
    MESSAGE = 'MESSAGE',
    MEDIA_LIST = 'MEDIA_LIST',
}

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
    avatar: {
        medium: string,
        large: string,
    },
}

export interface Page {
    mediaList?: MediaList[],
    activities?: ActivityUnion[],
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
    user: User,
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
    user: User,
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
    message: string,
    messenger: User,
    type: ActivityType,
    siteUrl: string,
    isLocked: boolean,
    isSubscribed: boolean,
    likeCount: number,
    replyCount: number,
}

export type ActivityUnion = TextActivity | ListActivity | MessageActivity;