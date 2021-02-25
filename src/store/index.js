import { reactive, computed, watch } from 'vue';
import { db, settingsRef } from '../firebase.js';
import router from '../router/index.js';
import { convertSettingPayload, convertSettings } from './internal.js';

const storeName = 'kobalos-manager-store';

const defaultManageSettingState = () => ({
  id: null,
  key: '',
  label: '',
  values: [],
});

const defaultState = () => ({
  user: {},
  settings: [],
  manageSetting: defaultManageSettingState(),
});

const state = reactive(localStorage.getItem(storeName) ? JSON.parse(localStorage.getItem(storeName)) : defaultState());

watch(state, (value) => localStorage.setItem(storeName, JSON.stringify(value)));

export const useStore = () => ({
  debug: true,

  // Getters
  user: computed(() => state.user),
  isSignIn: computed(() => Boolean(state.user?.uid)),
  settings: computed(() => state.settings.slice().reverse()),
  manageSettingId: computed(() => state.manageSetting.id),
  manageSettingLabel: computed(() => state.manageSetting.label),
  manageSettingKey: computed(() => state.manageSetting.key),
  manageSettingValues: computed(() => state.manageSetting.values),

  // Actions
  ResetStore() {
    state.user = {};
    state.settings = [];
    state.manageSetting = defaultManageSettingState();
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

  setSettings(data) {
    state.settings = convertSettings(data);
  },

  resetManageSetting() {
    state.manageSetting = defaultManageSettingState();
  },

  setManageSetting(payload) {
    console.log({ setManageSetting: payload });
    state.manageSetting = payload;
  },

  setManageSettingLabel(value) {
    state.manageSetting.label = value;
  },

  setManageSettingKey(value) {
    state.manageSetting.key = value;
  },

  setManageSettingValues(payload) {
    state.manageSetting.values = payload;
  },

  saveSetting() {
    return settingsRef.push(convertSettingPayload(state.manageSetting));
  },

  bulkRemoveSetting(payload) {
    if (typeof payload === 'string') payload = new Set().add({ id: payload });
    const deleted = {};
    payload.forEach((item) => {
      deleted[`kobalos/settings/${item.id}`] = null;
    });
    return db.ref().update(deleted);
  },
});
