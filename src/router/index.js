import { createRouter, createWebHashHistory } from 'vue-router';
import { auth } from '../firebase';
import Login from '../components/Login.vue';
import Features from '../components/Features.vue';
import Settings from '../components/Settings.vue';

const routes = [
  { path: '/', name: 'Login', component: Login },
  { path: '/features', name: 'Features', component: Features },
  { path: '/settings', name: 'Settings', component: Settings },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

auth.onAuthStateChanged((user) => {
  // console.log(user);
  if (user) {
    return router.push({ name: 'Features' });
  }
  router.push({ name: 'Login' });
});

export default router;
