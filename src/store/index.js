import { reactive, computed, watch } from 'vue';
import { db, featuresRef, settingsRef } from '../firebase.js';
import router from '../router/index.js';
import { convertFeaturePayload, convertFeatures, convertSettingPayload, convertSettings } from './internal.js';

const storeName = 'kobalos-manager-store';

const defaultManageFeatureState = () => ({
  id: null,
  title: '',
  name: '',
  variants: [],
});

const defaultManageSettingState = () => ({
  id: null,
  key: '',
  label: '',
  values: [],
});

const defaultState = () => ({
  user: {},
  features: [],
  settings: [],
  manageFeature: defaultManageFeatureState(),
  manageSetting: defaultManageSettingState(),
});

const state = reactive(localStorage.getItem(storeName) ? JSON.parse(localStorage.getItem(storeName)) : defaultState());

watch(state, (value) => localStorage.setItem(storeName, JSON.stringify(value)));

export const useStore = () => ({
  debug: false,

  // Getters

  user: computed(() => state.user),
  isSignIn: computed(() => Boolean(state.user?.uid)),
  features: computed(() => state.features.slice().reverse()),
  settings: computed(() => state.settings.slice().reverse()),
  manageSettingId: computed(() => state.manageSetting.id),
  manageSettingLabel: computed(() => state.manageSetting.label),
  manageSettingKey: computed(() => state.manageSetting.key),
  manageSettingValues: computed(() => state.manageSetting.values),
  manageFeatureId: computed(() => state.manageFeature.id),
  manageFeatureTitle: computed(() => state.manageFeature.title),
  manageFeatureName: computed(() => state.manageFeature.name),
  manageFeatureVariants: computed(() => state.manageFeature.variants),

  // Mutations

  resetStore() {
    Object.keys(defaultState()).forEach((key) => (state[key] = defaultState()[key]));
  },

  setFeatures(data) {
    state.features = convertFeatures(data);
  },

  setSettings(data) {
    state.settings = convertSettings(data);
  },

  resetManageSetting() {
    state.manageSetting = defaultManageSettingState();
  },

  setManageSetting(payload) {
    state.manageSetting = JSON.parse(JSON.stringify(payload));
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

  resetManageFeature() {
    state.manageFeature = defaultManageFeatureState();
  },

  setManageFeature(payload) {
    state.manageFeature = JSON.parse(JSON.stringify(payload));
  },

  setManageFeatureTitle(value) {
    state.manageFeature.title = value;
  },

  setManageFeatureName(value) {
    state.manageFeature.name = value;
  },

  setManageFeatureVariants(payload) {
    state.manageFeature.variants = payload;
  },

  // Actions

  signIn(user) {
    if (this.debug) console.log('signIn', user);
    state.user = user;
    router.push({ name: 'Features' });
  },

  signOut() {
    if (this.debug) console.log('signOut');
    this.resetStore();
    router.push({ name: 'Login' });
  },

  saveSetting() {
    const payload = convertSettingPayload(state.manageSetting);
    if (state.manageSetting.id) {
      return db.ref(`kobalos/settings/${state.manageSetting.id}`).update(payload);
    }
    return settingsRef.push(payload);
  },

  saveFeature() {
    const payload = convertFeaturePayload(state.manageFeature);
    if (state.manageFeature.id) {
      return db.ref(`kobalos/features/${state.manageFeature.id}`).update(payload);
    }
    return featuresRef.push(payload);
  },

  bulkRemoveSetting(payload) {
    if (typeof payload === 'string') payload = new Set().add({ id: payload });
    const deleted = {};
    payload.forEach((item) => {
      deleted[`kobalos/settings/${item.id}`] = null;
    });
    return db.ref().update(deleted);
  },

  bulkRemoveFeature(payload) {
    const deleted = {};
    payload.forEach((item) => {
      deleted[`kobalos/features/${item.id}`] = null;
    });
    return db.ref().update(deleted);
  },
});
