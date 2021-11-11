# Kirin for Anilist

Um cliente não oficial do [Anilist API](https://anilist.co/) para Android feito com React Native. 

## Build instructions

### Conseguindo um client ID

Vá para a URL https://anilist.co/settings/developer pegar o seu client ID (coloque o valor "kirinforanilist://" no campo "redirect URL") e então crie a variável de ambiente `ANILIST_CLIENT_ID` com o valor do seu client ID. No Linux, você pode fazer isso adicionando a linha `export ANILIST_CLIENT_ID=<seu client ID aqui>` para o seu arquivo .bashrc ou .zshrc e abrindo um terminal novo.

### Rodando o aplicativo

```bash
git clone https://github.com/roberto-ng/kirin-for-anilist
cd kirin-for-anilist
npm install
npm run start

# Em outro terminal
npx react-native run-android
```

## Screenshots

![Home page](/screenshots/home.png "")
![List page](/screenshots/list.png "")
![Details page](/screenshots/details.jpg "")
