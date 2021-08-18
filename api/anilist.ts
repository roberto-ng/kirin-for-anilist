import { MediaList } from '../model/anilist';

const url = 'https://graphql.anilist.co';

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