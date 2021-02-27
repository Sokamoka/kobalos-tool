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
    const data = snapshot.val();
    store.setSettings(data);
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
  } catch (error) {
    notify({ type: 'error', title: error.message, icon: 'error', duration: 4000 });
  }
};

const onSave = async () => {
  try {
    await store.saveSetting();
  } catch (error) {
    notify({ type: 'error', title: error.message, icon: 'error', duration: 4000 });
  }
  isModalVisible.value = false;
};
</script>
