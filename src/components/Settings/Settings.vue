<template>
  <div class="container m-auto">
    <div class="bg-white rounded-lg shadow-lg">
      <SettingList
        :settings="state.settings"
        @add="onAdd"
        @edit="onEdit"
        @remove="onRemove"
      />
    </div>
  </div>
  <SettingsModal v-model="isModalVisible" @save="onSave" @remove="onRemove"></SettingsModal>
</template>

<script setup>
import { dbErrorMessage } from '../../utils/db-error-message';
import { inject, onMounted, reactive, ref } from 'vue';
import { settingsRef } from '../../firebase';
import { useStore } from '../../store';
import SettingList from './SettingsList.vue';
import SettingsModal from './SettingsModal.vue';
import { TYPE_CONFIRM, TYPE_ERROR, TYPE_SUCCESS } from '../Dialog/internal';

const notify = inject('notify');

const store = useStore();
const isModalVisible = ref(false);
const state = reactive({
  settings: store.settings,
});

onMounted(async () => {
  settingsRef.on('value', (snapshot) => {
    store.setSettings(snapshot.val());
  });
});

const onAdd = () => {
  store.resetManageSetting();
  isModalVisible.value = true;
};

const onEdit = (payload) => {
  store.setManageSetting(payload);
  isModalVisible.value = true;
};

const onRemove = async (payload) => {
  const result = await notify({ type: TYPE_CONFIRM, title: 'Are you sure you want to delete?' });
  if (!result) return;
  isModalVisible.value = false;
  onRemoveProcess(new Set(payload.selected));
  if (payload.clear) payload.clear();
};

const onRemoveProcess = async (ids) => {
  try {
    await store.bulkRemove(ids, 'settings');
    notify({ type: TYPE_SUCCESS, title: 'Remove success', icon: 'check-circle'});
  } catch (error) {
    notify({ type: TYPE_ERROR, title: error.message, icon: 'error'});
  }
};

const onSave = async () => {
  try {
    await store.saveSetting();
    notify({ type: TYPE_SUCCESS, title: 'Save success', icon: 'check-circle' });
  } catch (error) {
    notify({ type: TYPE_ERROR, title: dbErrorMessage(error.message), icon: 'error'});
  } finally {
    isModalVisible.value = false;
  }
};
</script>
