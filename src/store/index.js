import { reactive, computed, watch } from 'vue';
import { settingsRef } from '../firebase.js';
import router from '../router/index.js';
import { convertSettings } from './internal.js';

const storeName = 'kobalos-manager-store';

const defaultState = () => ({
  user: {},
  settings: [],
});

const state = reactive(localStorage.getItem(storeName) ? JSON.parse(localStorage.getItem(storeName)) : defaultState());

watch(state, (value) => localStorage.setItem(storeName, JSON.stringify(value)));

export const useStore = () => ({
  debug: true,

  // Getters
  user: computed(() => state.user),
  isSignIn: computed(() => Boolean(state.user?.uid)),
  settings: computed(() => state.settings.slice().reverse()),

  // Actions
  ResetStore() {
    state.user = {};
    state.settings = [];
  },

  SignIn(newValue) {
    if (this.debug) {
      console.log('SignIn', newValue);
    }
    state.user = newValue;
    router.push({ name: 'Features' });
  },

  SignOut() {
    if (this.debug) {
      console.log('SignOut');
    }
    this.ResetStore();
    router.push({ name: 'Login' });
  },

  async getSettings() {
    if (state.settings.length > 0) return;
    // try {
    //   // await settingsRef.once('value');
    // } catch (error) {
    //   console.error(error.message);
    // }
    settingsRef.on('value', (snapshot) => {
      const data = snapshot.val();
      if (this.debug) console.log('ON-Settings:', data);
      state.settings = convertSettings(data);
    });
  },
});
