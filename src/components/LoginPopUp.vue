<script setup>
import { state } from '../state.js';

const props = defineProps({
  submit: {
    type: Function,
    required: true
  }
});
</script>

<template>
  <div class="login-popup-container">
    <div class="login-popup">
      <div class="login-title">Log In</div>
      <input type="text" v-model="state.loginInfo.username" placeholder="Username" />
      <input type="password" v-model="state.loginInfo.password" placeholder="Password" />
      <button @click="props.submit">Submit</button>
    </div>
  </div>
</template>

<style scoped>
.login-popup-container {
  position: absolute;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #0004;
  backdrop-filter: blur(5px);
  z-index: 20;
}

.login-popup {
  background-color: var(--background);
  padding: 1em;
  border-radius: 5px;
  box-shadow: -5px 5px 10px #0008;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}

.login-title {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 0.5em;
}
</style>
