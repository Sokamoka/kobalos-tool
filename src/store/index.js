import { reactive, computed, watch } from 'vue';
import { push, ref, update } from 'firebase/database';
import { findIndex, propEq, reject } from 'ramda';
import { db, featuresRef, settingsRef } from '../firebase.js';
import router from '../router/index.js';
import {
  convertEnvironments,
  convertEnvironmentsPayload,
  convertFeaturePayload,
  convertFeatures,
  convertSettingPayload,
  convertSettings,
  newEnvironment,
} from './internal.js';

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
  environments: [],
  maintenance: false,
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
  environments: computed(() => state.environments),
  isEnvironmentActionDisabled: computed(() => state.environments.some((item) => item.isNew)),
  manageSettingId: computed(() => state.manageSetting.id),
  manageSettingLabel: computed(() => state.manageSetting.label),
  manageSettingKey: computed(() => state.manageSetting.key),
  manageSettingValues: computed(() => state.manageSetting.values),
  manageFeatureId: computed(() => state.manageFeature.id),
  manageFeatureTitle: computed(() => state.manageFeature.title),
  manageFeatureName: computed(() => state.manageFeature.name),
  manageFeatureVariants: computed(() => state.manageFeature.variants),
  maintenance: computed(() => state.maintenance),

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

  setEnvironments(data) {
    state.environments = convertEnvironments(data);
  },

  updateEnvironment(payload) {
    const index = findIndex(propEq('id', payload.id))(state.environments);
    state.environments[index] = payload;
  },

  addEnvironment() {
    state.environments.unshift(newEnvironment());
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

  setMaintenance(value) {
    state.maintenance = value;
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
      return ref(db, `kobalos/settings/${state.manageSetting.id}`).update(payload);
    }
    return settingsRef.push(payload);
  },

  saveFeature() {
    const payload = convertFeaturePayload(state.manageFeature);
    console.log(payload);
    if (state.manageFeature.id) {
      const updates = {};
      updates[`kobalos/features/${state.manageFeature.id}`] = payload;
      return update(ref(db), updates);
    }
    return push(featuresRef, payload);
  },

  bulkRemove(payload, reference) {
    const deleted = {};
    payload.forEach((item) => {
      deleted[`kobalos/${reference}/${item.id}`] = null;
    });
    return update(ref(db), deleted);
  },

  setEnvironmentsRef() {
    return ref(db, 'environments').set(convertEnvironmentsPayload(state.environments));
  },

  removeEnvironment(payload) {
    if (payload.isNew) {
      state.environments = reject(propEq('id', payload.id))(state.environments);
      return;
    }
    return ref(db, `environments/${payload.id}`).remove();
  },

  setMaintenanceRef(value) {
    return ref(db, 'kobalos/maintenance').set(value);
  },
});
