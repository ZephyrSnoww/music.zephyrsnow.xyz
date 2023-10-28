<script setup>
import { reactive } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

let state = reactive({});
</script>

<template>
  <div class="left-bar">

  </div>

  <div class="bottom-bar">

  </div>

  <div class="main-view">
    <RouterView />
  </div>
</template>

<style scoped>
.left-bar {
  grid-area: left;
  z-index: 5;
  box-shadow: 0px 0px 15px #0008;
}

.bottom-bar {
  grid-area: bottom;
  z-index: 10;
  background-color: var(--background);
  box-shadow: 0px 0px 15px #0008;
}

.main-view {
  grid-area: main;
}
</style>
