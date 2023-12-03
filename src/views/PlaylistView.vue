<script setup>
import { reactive } from 'vue';
import { state } from '../state.js';
import { useRoute } from 'vue-router';
import { navidromeRequest, toTime } from '../helpers';

const route = useRoute();

let localState = reactive({
  playlist: undefined
});

let playlistInfo = state.availablePlaylists.find((playlist) => playlist['@_id'] == route.params.id);

navidromeRequest('getPlaylist', { id: playlistInfo['@_id'] }).then((resp) => {
  if (resp['@_status'] == 'ok') {
    localState.playlist = resp.playlist;

    console.log(localState.playlist)
  }
});

function selectSong (song) {
  state.currentlyPlaying = song;

  if (state.audioPlayer.playing) {
    document.querySelector('#audio-player').oncanplay = () => {
      document.querySelector('#audio-player').play();
      document.querySelector('#audio-player').oncanplay = null;
    }
  }
}
</script>

<template>
  <div class="view-container" v-if="localState.playlist">
    <h1>{{ localState.playlist['@_name'] }}</h1>

    <div class="playlist-entries-container">
      <div class="column-titles playlist-entry">
        <div>Title</div>
        <div>Album</div>
        <div>Duration</div>
        <div>Bitrate</div>
      </div>

      <div class="playlist-entry" v-for="entry in localState.playlist.entry">
        <div class="main">
          <img :src="`http://mc.zephyrsnow.xyz:4533/rest/getCoverArt?u=${state.loginInfo.username}&p=${state.loginInfo.password}&v=1.16.1&c=navidrome-utils&id=${entry['@_coverArt']}`" alt="" class="cover" @click="(e) => selectSong(entry)">
          <div class="info">
            <div class="title" @click="(e) => selectSong(entry)">{{ entry['@_title'] }}</div>
            <RouterLink v-if="entry['@_artistId']" class="artist" :to="`/artist/${entry['@_artistId']}`">{{ entry['@_artist'] }}</RouterLink>
            <div v-else class="artist">{{ entry['@_artist'] }}</div>
          </div>
        </div>
        <RouterLink :to="`/album/${entry['@_albumId']}`">{{ entry['@_album'] }}</RouterLink>
        <div>{{ toTime(entry['@_duration']) }}</div>
        <div>{{ entry['@_bitRate'] }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.view-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

h1 {
  padding: 0.5em;
  padding-bottom: 0;
  background-color: var(--background);
  z-index: 5;
}

a {
  text-decoration: underline;
  color: unset;
}

.playlist-entries-container {
  width: 100%;
  flex: 1 0;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}

.playlist-entry {
  display: grid;
  grid-template-columns: auto 25% 7% 7%;
  gap: 0.5em;
  padding: 0.5em 1em;
  background-color: var(--background);
  cursor: pointer;
}

.playlist-entry:hover {
  filter: brightness(1.5);
}

.playlist-entry > * {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.main {
  display: flex;
  gap: 0.5em;
}

.cover {
  aspect-ratio: 1;
  height: 3em;
}

.info {
  flex-direction: column;
  align-items: flex-start !important;
  justify-content: center !important;
  width: 100%;
}

.artist {
  filter: brightness(0.5);
  font-size: 0.8em;
}

.column-titles {
  font-size: 0.8em;
  position: sticky;
  top: 0;
  z-index: 5;
  box-shadow: 0px 0px 15px #0008;
}
</style>
