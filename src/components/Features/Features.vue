<template>
  <div class="container m-auto">
    <div class="flex flex-col bg-white rounded-lg shadow-lg">
      <List
        :columns="state.columns"
        :data="state.features"
        :search-filter="searchfFilter"
        @edit="onEdit"
        @remove="onRemove"
        @add="onClickAddNew"
      >
        <template v-slot:title="{ state }">
          <div class="mb-4 sm:mb-0 flex-grow">
            <h2 class="text-sm font-bold uppercase text-gray-900">
              Recent Features List
            </h2>
            <p class="text-xs text-gray-500 font-medium">
              Showing <b>{{ state.filteredCount }}</b> of <b>{{ state.total }}</b> features
            </p>
          </div>
        </template>

        <template v-slot:cell-names="{ row }">
          <h5 class="font-bold text-base">{{ row.title }}</h5>
          <p class="text-gray-500">{{ row.name }}</p>
        </template>
      </List>
    </div>
  </div>

  <FeatureModal v-model="state.isModalVisible" :feature="state.feature" @save="onSave" @remove="onRemove" />
</template>

<script setup>
import { defineAsyncComponent, inject, onMounted, reactive } from 'vue';
import { featuresRef } from '../../firebase';
import { useStore } from '../../store';
import { TYPE_CONFIRM, TYPE_ERROR, TYPE_SUCCESS } from '../Dialog/internal';
import { dbErrorMessage } from '../../utils/db-error-message';

const FeatureModal = defineAsyncComponent(() => import('./FeatureModal.vue'));
const BaseTagInput = defineAsyncComponent(() => import('../FormControls/BaseTagInput.vue'));
const List = defineAsyncComponent(() => import('../List.vue'));

const notify = inject('notify');

const store = useStore();

const state = reactive({
  isLoading: false,
  isModalVisible: false,
  features: store.features,
  columns: {
    index: {
      label: '#',
      class: 'w-1',
    },
    names: {
      label: 'Title',
      class: '',
      sortable: true
    },
    values: {
      label: 'Variants',
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

onMounted(() => {
  featuresRef.on('value', (snapshot) => {
    const data = snapshot.val();
    store.setFeatures(data);
  });
});

function onClickAddNew() {
  store.resetManageFeature();
  state.isModalVisible = true;
}

function onEdit(payload) {
  store.setManageFeature(payload);
  state.isModalVisible = true;
}

const onRemove = async (payload) => {
  const result = await notify({ type: TYPE_CONFIRM, title: 'Are you sure you want to delete?' });
  if (!result) return;
  state.isModalVisible = false;
  onRemoveProcess(new Set(payload.selected));
  if (payload.clear) payload.clear();
};

const onRemoveProcess = async (ids) => {
  try {
    await store.bulkRemove(ids, 'features');
    notify({ type: TYPE_SUCCESS, title: 'Delete success', icon: 'check-circle' });
  } catch (error) {
    notify({ type: TYPE_ERROR, title: error.message, icon: 'error' });
  }
};

const onSave = async (payload) => {
  try {
    await store.saveFeature();
    notify({ type: TYPE_SUCCESS, title: 'Save success', icon: 'check-circle' });
  } catch (error) {
    notify({ type: TYPE_ERROR, title: dbErrorMessage(error.message), icon: 'error' });
  } finally {
    state.isModalVisible = false;
  }
};

const searchfFilter = (data, value) =>
  data.filter(
    (item) =>
      item.title.toLowerCase().includes(value.toLowerCase()) || item.name.toLowerCase().includes(value.toLowerCase())
  );
</script>
