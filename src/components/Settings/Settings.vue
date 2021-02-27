<template>
  <div class="container m-auto">
    <div class="bg-white rounded-lg shadow-lg">
      <SettingList
        :settings="state.settings"
        @add="onAdd"
        @edit="onEdit"
        @remove="onRemove"
        @bulk-remove="onBulkRemove"
      />
    </div>
  </div>
  <SettingsModal v-model="isModalVisible" @save="onSave" @remove="onModalRemove"></SettingsModal>
</template>

<script setup>
import { inject, onMounted, reactive, ref } from 'vue';
import { settingsRef } from '../../firebase';
import { useStore } from '../../store';
import SettingList from './SettingsList.vue';
import SettingsModal from './SettingsModal.vue';

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

const onRemove = (id) => {
  onRemoveProcess(id);
};

const onModalRemove = async (id) => {
  const result = await notify({ type: 'confirm', title: 'Are you sure you want to delete?' });
  if (!result) return;
  isModalVisible.value = false;
  onRemoveProcess(id);
};

const onBulkRemove = async (payload) => {
  onRemoveProcess(payload);
};

const onRemoveProcess = async (ids) => {
  try {
    await store.bulkRemoveSetting(ids);
    notify({ type: 'success', title: 'Remove success', icon: 'check-circle'});
  } catch (error) {
    notify({ type: 'error', title: error.message, icon: 'error'});
  }
};

const onSave = async () => {
  try {
    await store.saveSetting();
    notify({ type: 'success', title: 'Save success', icon: 'check-circle' });
  } catch (error) {
    notify({ type: 'error', title: error.message, icon: 'error'});
  } finally {
    isModalVisible.value = false;
  }
};
</script>
