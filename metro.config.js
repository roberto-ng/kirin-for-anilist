// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

let config = getDefaultConfig(__dirname);

module.exports = {
    ...config,
    resolver: {
        sourceExts: ['js', 'ts', 'tsx', 'mjs'],
    },
};