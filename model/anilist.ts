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

export enum MediaListStatus {
    CURRENT = 'CURRENT',
    PLANNING = 'PLANNING',
    COMPLETED = 'COMPLETED',
    DROPPED = 'DROPPED',
    PAUSED = 'PAUSED',
    REPEATING = 'REPEATING',
}

export enum MediaType {
    ANIME = 'ANIME',
    MANGA = 'MANGA',
}

export enum MediaListSort {
    MEDIA_ID = 'MEDIA_ID',
    MEDIA_ID_DESC = 'MEDIA_ID_DESC',
    SCORE = 'SCORE',
    SCORE_DESC = 'SCORE_DESC',
    STATUS = 'STATUS',
    STATUS_DESC = 'STATUS_DESC',
    PROGRESS = 'PROGRESS',
    PROGRESS_DESC = 'PROGRESS_DESC',
    PROGRESS_VOLUMES = 'PROGRESS_VOLUMES',
    PROGRESS_VOLUMES_DESC = 'PROGRESS_VOLUMES_DESC',
    REPEAT = 'REPEAT',
    REPEAT_DESC = 'REPEAT_DESC',
    PRIORITY = 'PRIORITY',
    PRIORITY_DESC = 'PRIORITY_DESC',
    STARTED_ON = 'STARTED_ON',
    STARTED_ON_DESC = 'STARTED_ON_DESC',
    FINISHED_ON = 'FINISHED_ON',
    FINISHED_ON_DESC = 'FINISHED_ON_DESC',
    ADDED_TIME = 'ADDED_TIME',
    ADDED_TIME_DESC = 'ADDED_TIME_DESC',
    UPDATED_TIME = 'UPDATED_TIME',
    UPDATED_TIME_DESC = 'UPDATED_TIME_DESC',
    MEDIA_TITLE_ROMAJI = 'MEDIA_TITLE_ROMAJI',
    MEDIA_TITLE_ROMAJI_DESC = 'MEDIA_TITLE_ROMAJI_DESC',
    MEDIA_TITLE_ENGLISH = 'MEDIA_TITLE_ENGLISH',
    MEDIA_TITLE_ENGLISH_DESC = 'MEDIA_TITLE_ENGLISH_DESC',
    MEDIA_TITLE_NATIVE = 'MEDIA_TITLE_NATIVE',
    MEDIA_TITLE_NATIVE_DESC = 'MEDIA_TITLE_NATIVE_DESC',
    MEDIA_POPULARITY = 'MEDIA_POPULARITY',
    MEDIA_POPULARITY_DESC = 'MEDIA_POPULARITY_DESC',
}

export interface Media {
    id: string,
    episodes?: number,
    chapters?: number,
    status: MediaStatus,
    type: MediaType,
    title: {
        romaji: string,
        english: string,
        native: string,
    },
    coverImage: {
        medium: string,
        large: string,
        extraLarge: string,
    },
    mediaListEntry: {
        score: number,
    },
}

export interface MediaList {
    id: number,
    progress: number,
    updatedAt: number,
    media: Media,
    status: MediaListStatus,
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
    media: Media[],
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
    createdAt: number,
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
    createdAt: number,
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
    createdAt: number,
}

export type ActivityUnion = TextActivity | ListActivity | MessageActivity;