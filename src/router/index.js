import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue')
    },
    {
      path: '/playlists',
      name: 'playlists',
      component: () => import('../views/PlaylistsView.vue')
    },
    {
      path: '/playlists/:id',
      name: 'playlist',
      component: () => import('../views/PlaylistView.vue')
    }
  ]
});

export default router;
