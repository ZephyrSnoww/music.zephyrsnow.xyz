<script setup>
import { RouterLink, RouterView } from 'vue-router';
import LoginPopUp from './components/LoginPopUp.vue';
import { state } from './state.js';
import { navidromeRequest, toTime } from './helpers';

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
    'icon': '',
    'text': 'Playlists',
    'link': '/playlists'
  }
];

function togglePlaying () {
  if (state.audioPlayer.playing) {
    state.audioPlayer.playing = false;
    document.querySelector('#audio-player').pause();
  }
  else {
    state.audioPlayer.playing = true;
    document.querySelector('#audio-player').play();
  }
}

function changeVolume (e) {
  if (e.buttons == 1 || e.type == 'mouseup') {
    let value = Math.round((e.layerX / e.target.offsetWidth) * 100);
    state.audioPlayer.volume = value;
  }
}

function seek (e) {
  if (e.buttons == 1 || e.type == 'mouseup') {
    let value = e.layerX / e.target.offsetWidth;
    document.querySelector('#audio-player').currentTime = document.querySelector('#audio-player').duration * value;
    state.audioPlayer.time = document.querySelector('#audio-player').duration * value;
  }
}

function toggleLike () {
  if (state.currentlyPlaying['@_starred']) {
    navidromeRequest('unstar', {
      id: state.currentlyPlaying['@_id']
    }).then((resp) => {
      if (resp['@_status'] == 'ok') {
        state.currentlyPlaying['@_starred'] = undefined;
      }
    });
  }
  else {
    navidromeRequest('star', {
      id: state.currentlyPlaying['@_id']
    }).then((resp) => {
      if (resp['@_status'] == 'ok') {
        state.currentlyPlaying['@_starred'] = true;
      }
    });
  }
}
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
    <audio
      v-if="state.currentlyPlaying"
      class="player"
      id="audio-player"
      :src="`http://mc.zephyrsnow.xyz:4533/rest/stream?u=${state.loginInfo.username}&p=${state.loginInfo.password}&v=1.16.1&c=navidrome-utils&id=${state.currentlyPlaying['@_id']}`"
      controls
      :volume="state.audioPlayer.volume / 100"
      :loop="state.audioPlayer.loopSingle"
      :ontimeupdate="(e) => state.audioPlayer.time = e.target.currentTime"
    ></audio>

    <div class="custom-player" v-if="state.currentlyPlaying">
      <!-- Song info -->
      <div class="song-info-container">
        <img :src="`http://mc.zephyrsnow.xyz:4533/rest/getCoverArt?u=${state.loginInfo.username}&p=${state.loginInfo.password}&v=1.16.1&c=navidrome-utils&id=${state.currentlyPlaying['@_coverArt']}`" alt="" class="song-cover">
        <div class="song-info">
          <div class="song-title">{{ state.currentlyPlaying['@_title'] }}</div>
          <RouterLink class="song-artist" :to="`/artist/${state.currentlyPlaying['@_artistId']}`">{{ state.currentlyPlaying['@_artist'] }}</RouterLink>
          <RouterLink class="song-album" :to="`/artist/${state.currentlyPlaying['@_albumId']}`">{{ state.currentlyPlaying['@_album'] }}</RouterLink>
        </div>
      </div>

      <!-- Player controls -->
      <div class="player-controls-container">
        <div class="top">
          <div class="icon">skip_previous</div>
          <div class="icon" @click="togglePlaying">{{ state.audioPlayer.playing ? 'pause_circle_filled' : 'play_circle_filled' }}</div>
          <div class="icon">skip_next</div>
        </div>

        <div class="bottom">
          <div class="current-time">{{ toTime(state.audioPlayer.time) }}</div>
          <div class="progress-bar-container" @mouseup="seek" @mousemove="seek">
            <div class="progress-bar" :style="{
              width: `${(state.audioPlayer.time / state.currentlyPlaying['@_duration']) * 100}%`
            }"></div>
          </div>
          <div class="total-time">{{ toTime(state.currentlyPlaying['@_duration']) }}</div>
        </div>
      </div>

      <!-- Other controls -->
      <div class="other-controls-container">
        <!-- <div class="other-top">idk</div> -->
        <div class="other-middle">
          <div class="icon" @click="toggleLike" :style="{
            color: state.currentlyPlaying['@_starred'] ? 'var(--blue)' : ''
          }">{{ state.currentlyPlaying['@_starred'] ? 'favorite' : 'favorite_border' }}</div>
          <div class="icon" @click="() => state.audioPlayer.loopSingle = !state.audioPlayer.loopSingle" :style="{
            color: state.audioPlayer.loopSingle ? 'var(--blue)' : ''
          }">repeat_one</div>
          <div class="icon">shuffle</div>
          <div class="icon">queue_music</div>
        </div>
        <div class="other-bottom">
          <div class="icon">{{
            state.audioPlayer.volume >= 66
              ? 'volume_up'
              : state.audioPlayer.volume >= 33
                ? 'volume_down'
                : state.audioPlayer.volume > 0
                  ? 'volume_mute'
                  : 'volume_off'
          }}</div>
          <div class="volume-container" @mouseup="changeVolume" @mousemove="changeVolume">
            <div class="volume" :style="{
              width: `${state.audioPlayer.volume}%`
            }"></div>
            <span>{{ state.audioPlayer.volume }}%</span>
          </div>
        </div>
      </div>
    </div>
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

.player {
  width: 100%;
  height: 100%;
  display: none;
}

.player::-webkit-media-timeline-container {
  width: 100%;
  height: 100%;
}

.custom-player {
  width: 100vw;
  height: 100%;
  display: flex;
  padding: 0.75em;
  gap: 0.5em;
}

.custom-player > * {
  height: 100%;
  /* background-color: #0006; */
}

.song-info-container {
  flex: 0 0 25%;
  width: 25%;
  display: flex;
  gap: 0.5em;
}

.song-cover {
  aspect-ratio: 1;
  height: 100%;
}

.song-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-evenly;
  overflow: hidden;
}

.song-info > * {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
}

.player-controls-container {
  flex: 1 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
}

.top {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;

  font-size: 1.75em;
}

.top > * {
  cursor: pointer;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 2em;
  width: 100%;
  gap: 0.5em;
}

.progress-bar-container {
  flex: 1 0;
  height: 5px;
  background-color: white;
}

.progress-bar {
  background-color: var(--blue);
  height: 100%;
  width: 30%;
  pointer-events: none;
}

.other-controls-container {
  flex: 0 0 25%;
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-evenly;
}

.other-middle {
  display: flex;
  font-size: 1.5em;
  gap: 0.5em;
}

.other-middle > div {
  cursor: pointer;
}

.other-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}

.volume-container {
  font-size: 0.6em;
  font-weight: bold;
  text-align: center;
  width: 200px;
  background-color: white;
  user-select: none;
  height: min-content;
}

.volume {
  background-color: var(--blue);
  pointer-events: none;
  position: absolute;
  height: 100%;
}

.volume-container span {
  color: black;
  pointer-events: none;
}

.main-view {
  grid-area: main;
  overflow: scroll;
}
</style>
