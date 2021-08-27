import { 
    Media, 
    MediaList, 
    User, 
    Page,
    ActivityUnion, 
    MediaType,
    MediaListStatus,
} from '../model/anilist';

const url = 'https://graphql.anilist.co';

export async function fetchViewer(accessToken: string): Promise<User> {
    const query = `
        query {
            Viewer {
                id
                name
                avatar {
                    medium
                    large
                }
            }
        }
    `;
    
    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: {},
        }),
    };
    
    const res = await fetch(url, options);
    const user = (await res.json()).data.Viewer as User;
    return user;
}

export async function increaseMediaProgression(token: string, mediaList: MediaList): Promise<void> {
    let query = `
        mutation ($mediaId: Int, $progress: Int) {
            SaveMediaListEntry (mediaId: $mediaId, progress: $progress) {
                mediaId
                progress
            }
        }
    `;

    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: {
                mediaId: mediaList.media.id,
                progress: mediaList.progress + 1,
            },
        }),
    };
    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error(await res.text());
    }
}

export async function fetchAnimeInProgress(accessToken: string, userId: string): Promise<MediaList[]> {
    const query = `
        query ($id: Int, $page: Int, $perPage: Int) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                mediaList (userId: $id, type: ANIME, status: CURRENT, sort: UPDATED_TIME_DESC) {
                    id
                    progress
                    updatedAt
                    status
                    media {
                        id
                        episodes
                        status
                        type
                        title {
                            romaji
                            english
                            native
                        }
                        coverImage {
                            medium
                            large
                            extraLarge
                        }
                    }
                }
            }
        }
    `;

    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: {
                id: userId,
                page: 1,
                perPage: 50,
            },
        }),
    };

    const res = await fetch(url, options);
    const json = await res.json();
    const page = json.data.Page as Page;
    if (page.mediaList == null) {
        throw new Error('The Page object has no mediaList member');
    }

    return page.mediaList;
}

export async function fetchMangaInProgress(accessToken: string, userId: string): Promise<MediaList[]> {
    const query = `
        query ($id: Int, $page: Int, $perPage: Int) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                mediaList (userId: $id, type: MANGA, status: CURRENT, sort: UPDATED_TIME_DESC) {
                    id
                    progress
                    updatedAt
                    status
                    media {
                        id
                        episodes
                        chapters
                        status
                        type
                        title {
                            romaji
                            english
                            native
                        }
                        coverImage {
                            medium
                            large
                            extraLarge
                        }
                    }
                }
            }
        }
    `;

    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: {
                id: userId,
                page: 1,
                perPage: 50,
            },
        }),
    };

    const res = await fetch(url, options);
    const json = await res.json();
    const page = json.data.Page as Page;
    if (page.mediaList == null) {
        throw new Error('The Page object has no mediaList member');
    }

    return page.mediaList;
}

export async function fetchActivities(accessToken: string): Promise<ActivityUnion[]> {
    const query = `
        query ($page: Int, $perPage: Int) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                activities (isFollowing: true, sort: ID_DESC) {
                    ...on TextActivity {
                        id
                        userId
                        type
                        text
                        isLocked
                        likeCount
                        replyCount
                        siteUrl
                        isSubscribed
                        createdAt
                        user {
                            id
                            name
                            avatar {
                                medium
                                large
                            }
                        }
                    }

                    ...on ListActivity {
                        id
                        userId
                        type
                        status
                        progress
                        createdAt
                        media {
                            id
                            episodes
                            status
                            title {
                                romaji
                                english
                                native
                            }
                            coverImage {
                                medium
                                large
                                extraLarge
                            }    
                        }
                        isLocked
                        likeCount
                        replyCount
                        siteUrl
                        isSubscribed
                        user {
                            id
                            name
                            avatar {
                                medium
                                large
                            }
                        }
                    }

                    ...on MessageActivity {
                        id
                        recipientId
                        messengerId     
                        message
                        siteUrl
                        isSubscribed
                        createdAt
                        messenger {
                            id
                            name
                            avatar {
                                medium
                                large
                            }
                        }
                    }
                }
            }
        }
    `;

    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: {
                page: 1,
                perPage: 15,
            },
        }),
    };

    const res = await fetch(url, options);
    const json = await res.json();
    const page = json.data.Page as Page;
    if (page.activities == null) {
        throw new Error('The Page object has no \'activities\' member');
    }

    return page.activities;
}

export async function fetchMediaList(
    accessToken: string, 
    userId: string, 
    mediaType: MediaType,
    status: MediaListStatus,
): Promise<MediaList[]> {
    const query = `
        query ($id: Int, $page: Int, $perPage: Int, $mediaType: MediaType, $status: MediaListStatus) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                mediaList (userId: $id, type: $mediaType, status: $status, sort: MEDIA_TITLE_ROMAJI) {
                    id
                    progress
                    updatedAt
                    status
                    media {
                        id
                        episodes
                        chapters
                        status
                        type
                        title {
                            romaji
                            english
                            native
                        }
                        coverImage {
                            medium
                            large
                            extraLarge
                        }
                    }
                }
            }
        }
    `;

    const options = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: {
                id: userId,
                page: 1,
                perPage: 50,
                mediaType,
                status,
            },
        }),
    };

    const res = await fetch(url, options);
    const json = await res.json();
    const page = json.data.Page as Page;
    if (page.mediaList == null) {
        throw new Error('The Page object has no mediaList member');
    }

    return page.mediaList;
}