import { NativeModules } from "react-native";

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
    const formatter = new Intl.RelativeTimeFormat(locale);
    let duration = (date.getTime() - Date.now()) / 1000;
    for (const division of DIVISIONS) {
        if (Math.abs(duration) < division.amount) {
            return formatter.format(Math.round(duration), division.name as any);
        }
        duration /= division.amount;
    }

    return '';
}


function getSystemLocale(): string {
    let locale: string | undefined = undefined;
    if (
        NativeModules.SettingsManager &&
        NativeModules.SettingsManager.settings &&
        NativeModules.SettingsManager.settings.AppleLanguages
    ) {
        // iOS
        locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
    } else if (NativeModules.I18nManager) {
        // Android
        locale = NativeModules.I18nManager.localeIdentifier;
    }
  
    if (typeof locale === 'undefined') {
        console.log('Couldnt get locale');
        return 'en';
    }

    if (locale.trim() === 'pt' || locale.startsWith('pt-') || locale.startsWith('pt_')) {
        return 'pt';
    }
    if (locale.trim() === 'en' || locale.startsWith('en-') || locale.startsWith('en_')) {
        return 'en';
    }
  
    // fallback locale
    return 'en';
}

export const locale: string = getSystemLocale();