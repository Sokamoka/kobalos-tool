import { createRouter, createWebHistory } from 'vue-router';
import { useStore } from '../store';

const store = useStore();

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../components/Login.vue'),
    beforeEnter: (_to, _from, next) => {
      if (store.isSignIn.value) next({ name: 'Features' });
      else next();
    },
  },
  {
    path: '/features',
    name: 'Features',
    component: () => import('../components/Features/Features.vue'),
    meta: {
      requiresAuth: true,
      title: 'A/B Tests',
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../components/Settings.vue'),
    meta: {
      requiresAuth: true,
      title: 'Site settings',
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.isSignIn.value) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
