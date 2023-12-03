<script setup>
import { state } from '../state.js';
import { reactive } from 'vue';

let localState = reactive({
  viewType: 'list'
});
</script>

<template>
  <div class="view-container">
    <h1>Playlists</h1>

    <div class="playlists-list-container" v-if="localState.viewType == 'list'">
      <div class="column-titles playlist-list-item">
        <div>Title</div>
        <div>Tracks</div>
        <div>Owner</div>
        <div>Modified</div>
      </div>

      <RouterLink v-for="playlist in state.availablePlaylists" :to="`/playlists/${playlist['@_id']}`" class="playlist-list-item">
        <div>{{ playlist['@_name'] }}</div>
        <div>{{ playlist['@_songCount'] }}</div>
        <div>{{ playlist['@_owner'] }}</div>
        <div>{{ playlist['@_changed'] }}</div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.view-container {
  display: flex;
  flex-direction: column;
  /* padding: 1em; */
  height: 100%;
}

h1 {
  z-index: 5;
  padding: 0.5em;
}

.playlists-list-container {
  width: 100%;
  flex: 1 0;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}

.playlist-list-item {
  display: grid;
  grid-template-columns: auto 5% 12% 13%;
  gap: 0.5em;
  padding: 0.5em 1em;
  background-color: var(--background);
  color: unset;
  cursor: pointer;
  filter: brightness(1);
}

.playlist-list-item:hover {
  filter: brightness(1.5);
}

.column-titles {
  font-size: 0.8em;
  position: sticky;
  top: 0;
  z-index: 5;
  box-shadow: 0px 0px 15px #0008;
}
</style>
