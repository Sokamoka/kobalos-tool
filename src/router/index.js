import { ref } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
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
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../components/Settings.vue'),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);

  if (requiresAuth && !store.isSignIn.value) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
