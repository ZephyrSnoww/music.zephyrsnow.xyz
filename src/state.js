import { reactive } from 'vue';

export const state = reactive({
  loaded: false,
  currentlyPlaying: null,
  availablePlaylists: [],
  loggedIn: false,
  loginInfo: {
    username: '',
    password: ''
  },
  audioPlayer: {
    playing: false,
    time: 0,
    volume: 100,
    loopSingle: false
  }
  // current playing song
  // playlists
  // login info (store in localstorage)
});
