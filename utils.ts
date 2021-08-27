const DIVISIONS = [
    { amount: 60, name: 'seconds' },
    { amount: 60, name: 'minutes' },
    { amount: 24, name: 'hours' },
    { amount: 7, name: 'days' },
    { amount: 4.34524, name: 'weeks' },
    { amount: 12, name: 'months' },
    { amount: Number.POSITIVE_INFINITY, name: 'years' }
];

export function dateFromUnixTimestamp(timestamp: number): Date {
    return new Date(timestamp * 1000);
}

export function getRelativeTime(createdAt: number): string {
    const date = dateFromUnixTimestamp(createdAt);
    let duration = (date.getTime() - Date.now()) / 1000;
    const formatter = new Intl.RelativeTimeFormat('us');
    for (const division of DIVISIONS) {
        if (Math.abs(duration) < division.amount) {
            return formatter.format(Math.round(duration), division.name as any);
        }
        duration /= division.amount;
    }

    return '';
}