<template>
  <div class="container m-auto">
    <div class="bg-white rounded-lg shadow-lg">
      <List
        :columns="state.columns"
        :data="state.settings"
        :search-filter="searchfFilter"
        @edit="onEdit"
        @remove="onRemove"
        @add="onAdd"
      >
        <template v-slot:title="{ state }">
          <div class="mb-4 sm:mb-0 flex-grow">
            <h2 class="text-sm font-bold uppercase text-gray-900">
              Recent Setting List
            </h2>
            <p class="text-xs text-gray-500 font-medium">
              Showing <b>{{ state.filteredCount }}</b> of <b>{{ state.total }}</b> settings
            </p>
          </div>
        </template>

        <template v-slot:cell-title="{ row }">
          <h5 class="font-bold text-base">{{ row.label }}</h5>
          <p class="text-gray-500">{{ row.key }}</p>
        </template>
      </List>
    </div>
  </div>
  <SettingsModal v-model="isModalVisible" @save="onSave" @remove="onRemove"></SettingsModal>
</template>

<script setup>
import { dbErrorMessage } from '../../utils/db-error-message';
import { defineAsyncComponent, inject, onMounted, reactive, ref } from 'vue';
import { settingsRef } from '../../firebase';
import { useStore } from '../../store';
import { TYPE_CONFIRM, TYPE_ERROR, TYPE_SUCCESS } from '../Dialog/internal';

const List = defineAsyncComponent(() => import('../List.vue'));
const SettingsModal = defineAsyncComponent(() => import('./SettingsModal.vue'));

const notify = inject('notify');

const store = useStore();

const isModalVisible = ref(false);
const state = reactive({
  settings: store.settings,
  columns: {
    index: {
      label: '#',
      class: 'w-1',
    },
    title: {
      label: 'Title',
      class: '',
    },
    values: {
      label: 'Labels',
      class: '',
    },
    edit: {
      label: 'Edit',
      class: 'w-1 text-center',
    },
    delete: {
      label: 'Delete',
      class: 'w-1',
    },
  },
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
    notify({ type: TYPE_ERROR, title: dbErrorMessage(error.message), icon: 'error'});
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

const searchfFilter = (data, value) =>
  data.filter(
    (item) =>
      item.label.toLowerCase().includes(value.toLowerCase()) || item.key.toLowerCase().includes(value.toLowerCase())
  );
</script>
