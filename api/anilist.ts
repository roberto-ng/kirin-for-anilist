import { 
    Media, 
    MediaList, 
    User, 
    Page,
    ActivityUnion, 
    MediaType,
    MediaListStatus,
    MediaListSort,
    Character,
    MediaListEntryFull,
    MediaListEntryWrapper,
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

export async function incrementMediaProgression(token: string, mediaList: MediaList): Promise<void> {
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
    const page = await fetchMediaList(
        accessToken, 
        userId, 
        MediaType.ANIME, 
        MediaListStatus.CURRENT, 
        MediaListSort.UPDATED_TIME_DESC, 
        1,
    );

    if (page.mediaList == null) {
        throw new Error('The Page object has no mediaList member');
    }

    return page.mediaList;
}

export async function fetchMangaInProgress(accessToken: string, userId: string): Promise<MediaList[]> {
    const page = await fetchMediaList(
        accessToken, 
        userId, 
        MediaType.MANGA, 
        MediaListStatus.CURRENT, 
        MediaListSort.UPDATED_TIME_DESC, 
        1,
    );
    
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
                            averageScore
                            meanScore
                            popularity
                            isLocked
                            nextAiringEpisode {
                                id
                                airingAt
                                timeUntilAiring
                                episode
                                mediaId
                            }
                            startDate {
                                year
                                month
                                day
                            }
                            endDate {
                                year
                                month
                                day
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
    sort: MediaListSort,
    pageNumber: number,
): Promise<Page> {
    const query = `
        query ($id: Int, $page: Int, $perPage: Int, $mediaType: MediaType, $status: MediaListStatus, $sort: [MediaListSort]) {
            Page (page: $page, perPage: $perPage) {
                pageInfo {
                    total
                    currentPage
                    lastPage
                    hasNextPage
                    perPage
                }
                mediaList (userId: $id, type: $mediaType, status: $status, sort: $sort) {
                    id
                    progress
                    updatedAt
                    status
                    media {
                        id
                        episodes
                        chapters
                        volumes
                        status
                        type
                        description
                        format
                        averageScore
                        meanScore
                        popularity
                        isLocked
                        nextAiringEpisode {
                            id
                            airingAt
                            timeUntilAiring
                            episode
                            mediaId
                        }
                        startDate {
                            year
                            month
                            day
                        }
                        endDate {
                            year
                            month
                            day
                        }
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
                        bannerImage
                        mediaListEntry {
                            score
                            status
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
                page: pageNumber,
                perPage: 50,
                sort,
                mediaType,
                status,
            },
        }),
    };

    const res = await fetch(url, options);
    const json = await res.json();
    if (json.data == null) {
        if (json.errors != null && json.errors.length > 0) {
            throw new Error(json.errors[0].message);
        } else {
            throw new Error('data is null');
        }
    }

    const page = json.data.Page as Page;
    if (page.mediaList == null) {
        throw new Error('page object has no mediaList member');
    }

    return page;
}

export async function fetchMediaCharacters(mediaId: number): Promise<Character[]> {
    let query = `
        query ($mediaId: Int) {
            Media (id: $mediaId) {
                characters {
                    nodes {
                        id
                        name {
                            full
                            native
                        }
                        image {
                            large
                            medium
                        }
                        description
                        gender
                        isFavourite
                        isFavouriteBlocked
                        favourites
                    }
                }
            }
        }
    `;

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            query,
            variables: {
                mediaId: mediaId,
            },
        }),
    };

    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error(await res.text());
    }
    const json = await res.json();
    if (json.data == null) {
        if (json.errors != null && json.errors.length > 0) {
            throw new Error(json.errors[0].message);
        } else {
            throw new Error('data is null');
        }
    }

    const characters = json.data.Media.characters.nodes as Character[];
    if (characters == null) {
        throw new Error('Result has no characters member');
    }

    return characters;
}

export async function fetchMediaListEntry(accessToken: string, mediaId: number): Promise<MediaListEntryFull | null> {
    const query = `
        query ($mediaId: Int) {
            Media(id: $mediaId) {
                mediaListEntry {
                    status
                    score
                    progress
                    progressVolumes
                    repeat
                    priority
                    private
                    notes
                    startedAt {
                        year
                        month
                        day
                    }
                    completedAt {
                        year
                        month
                        day
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
                mediaId,
            },
        }),
    };
    
    const res = await fetch(url, options);
    const json = await res.json();
    const media = json.data.Media as MediaListEntryWrapper;
    if (media?.mediaListEntry != null) {
        return media.mediaListEntry;
    } else {
        return null;
    }
}

export async function saveListEntry(
    token: string, 
    mediaId: number,
    listEntry: MediaListEntryFull,
): Promise<void> {
    let query = `
        mutation (
            $mediaId: Int, 
            $status: MediaListStatus,
            $score: Float,
            $progress: Int, 
            $progressVolumes: Int,
            $repeat: Int,
            $startedAt: FuzzyDateInput,
            $completedAt: FuzzyDateInput,
        ) {
            SaveMediaListEntry (
                mediaId: $mediaId, 
                status: $status,
                score: $score,
                progress: $progress,
                progressVolumes: $progressVolumes,
                repeat: $repeat,
                startedAt: $startedAt,
                completedAt: $completedAt,                
            ) {
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
                mediaId: mediaId,
                status: listEntry.status,
                score: listEntry.score,
                progress: listEntry.progress,
                progressVolumes: listEntry.progressVolumes,
                repeat: listEntry.repeat,
                startedAt: listEntry.startedAt,
                completedAt: listEntry.completedAt,                
            },
        }),
    };
    const res = await fetch(url, options);
    if (!res.ok) {
        throw new Error(await res.text());
    }
}
