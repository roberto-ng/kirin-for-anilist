# Kirin for Anilist

An unofficial [Anilist API](https://anilist.co/) client for Android made with React Native.

## Build instructions

### Getting a client ID

First of all, go to https://anilist.co/settings/developer to get a client ID (be sure to set the redirect URL as "kirinforanilist://") and then set the enviroment variable `ANILIST_CLIENT_ID` with your client ID as its value. On Linux, you can do this by adding the line `export ANILIST_CLIENT_ID=<your client ID here>` to your .bashrc or .zshrc file and opening a new terminal.

### Running the app

```bash
git clone https://github.com/roberto-ng/kirin-for-anilist
cd kirin-for-anilist
npm install
npm run start

# On other terminal
npx react-native run-android
```

## Screenshots

![Home page](/screenshots/home.png "")
![List page](/screenshots/list.png "")
![Details page](/screenshots/details.jpg "")
