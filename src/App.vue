<script setup>
import { RouterLink, RouterView } from 'vue-router';
import LoginPopUp from './components/LoginPopUp.vue';
import { state } from './state.js';
import { navidromeRequest } from './helpers';
import MusicPlayer from './components/MusicPlayer.vue';

function login () {
  console.log(state.loginInfo);

  navidromeRequest('getRandomSongs').then((resp) => {
    if (resp['@_status'] == 'ok') {
      state.loggedIn = true;

      localStorage.setItem('username', JSON.stringify(state.loginInfo.username));
      localStorage.setItem('password', JSON.stringify(state.loginInfo.password));
      localStorage.setItem('loggedIn', 'true');

      navidromeRequest('getPlaylists').then((resp) => {
        state.availablePlaylists = resp.playlists.playlist;

        state.loaded = true;
      });
    }
  });
}

if (localStorage.getItem('loggedIn') == 'true') {
  state.loginInfo.username = localStorage.getItem('username');
  state.loginInfo.password = localStorage.getItem('password');

  navidromeRequest('getRandomSongs').then((resp) => {
    if (resp['@_status'] == 'ok') {
      state.loggedIn = true;

      navidromeRequest('getPlaylists').then((resp) => {
        state.availablePlaylists = resp.playlists.playlist;

        state.loaded = true;
      });
    }
    else {
      localStorage.setItem('loggedIn', 'false');
    }
  });
}

const tabs = [
  {
    'icon': 'search',
    'text': 'Search',
    'link': '/search'
  },
  {
    'icon': 'library_music',
    'text': 'Songs',
    'link': '/songs'
  },
  {
    'icon': 'album',
    'text': 'Albums',
    'link': '/albums'
  },
  {
    'icon': 'favorite',
    'text': 'Favorites',
    'link': '/favorites'
  },
  {
    'icon': 'folder',
    'text': 'Playlists',
    'link': '/playlists'
  },
  {
    'icon': 'settings',
    'text': 'Settings',
    'link': '/settings'
  }
];
</script>

<template>
  <LoginPopUp
    v-if="!state.loggedIn"
    :submit="login"
  />

  <div class="left-bar">
    <div class="tabs-container">
      <RouterLink v-for="tab in tabs" :to="tab.link" class="tab">
        <div class="icon">{{ tab.icon }}</div>
        <div class="text">{{ tab.text }}</div>
      </RouterLink>
    </div>

    <div class="playlists-container">
      <div class="playlists">
        <RouterLink
          :to="`/playlists/${playlist['@_id']}`"
          class="playlist-name"
          v-for="playlist in state.availablePlaylists"
        >
          {{ playlist['@_name'] }}
        </RouterLink>
      </div>
    </div>
  </div>

  <div class="bottom-bar">
    <MusicPlayer />
  </div>

  <div class="main-view">
    <RouterView v-if="state.loaded" :key="$route.fullPath" />
  </div>
</template>

<style scoped>
.left-bar {
  grid-area: left;
  z-index: 25;
  box-shadow: 0px 0px 15px #0008;

  display: grid;
  grid-template-rows: 50% 50%;
  grid-template-areas: "tabs" "playlists";
}

.tabs-container {
  display: flex;
  flex-direction: column;
  padding: 0.5em 0;
  overflow-y: scroll;
}

.tab {
  padding: 0.25em 0.5em;
  display: flex;
  gap: 0.33em;
  justify-content: flex-start;
  align-items: center;
  font-size: 1.25em;
}

.playlists-container {
  padding: 1em;
  grid-area: playlists;
  overflow-y: scroll;
  border-top: 1px solid var(--text);
}

.playlists {
  display: flex;
  flex-direction: column;
}

.playlist-name {
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.bottom-bar {
  grid-area: bottom;
  z-index: 30;
  background-color: var(--background);
  box-shadow: 0px 0px 15px #0008;
}

.main-view {
  grid-area: main;
  overflow: scroll;
}
</style>
