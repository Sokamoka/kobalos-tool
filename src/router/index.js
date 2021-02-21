import { ref } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { useStore } from '../store';
import Login from '../components/Login.vue';
import Features from '../components/Features.vue';
import Settings from '../components/Settings.vue';

const store = useStore();
const isSignIn = ref(store.isSignIn);

const routes = [
  { path: '/', name: 'Login', component: Login },
  {
    path: '/features',
    name: 'Features',
    component: Features,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
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

  if (requiresAuth && !isSignIn.value) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
