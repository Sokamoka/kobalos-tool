<template>
  <div class="container m-auto">
    <div class="flex flex-col bg-white rounded-lg shadow-lg">
      <FeatureList
        :features="state.features"
        :is-loading="state.isLoading"
        @edit="onEdit"
        @remove="onRemove"
        @add="onClickAddNew"
        @bulk-remove="onBulkRemove"
      />
    </div>
  </div>

  <FeatureModal v-model="state.isModalVisible" :feature="state.feature" @save="onSave" @remove="onModalRemove" />

</template>

<script setup>
import { computed, defineAsyncComponent, inject, onMounted, reactive } from 'vue';
import { nanoid } from 'nanoid';
import { db, featuresRef } from '../../firebase';
import { useStore } from '../../store';

const FeatureModal = defineAsyncComponent(() => import('./FeatureModal.vue'));
const FeatureList = defineAsyncComponent(() => import('./FeatureList.vue'));
const BaseTagInput = defineAsyncComponent(() => import('../FormControls/BaseTagInput.vue'));

const confirm = inject('notify');

const store = useStore();

const state = reactive({
  isLoading: false,
  isModalVisible: false,
  features: store.features,
});

onMounted(async () => {
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

const onModalRemove = async (id) => {
  const result = await confirm({ type: 'confirm', title: 'Are you sure you want to delete?' });
  if (!result) return;
  onRemoveProcess(id);
  state.isModalVisible = false;
};

const onRemove = async (id) => {
  onRemoveProcess(id);
};

const onBulkRemove = async (payload) => {
  onRemoveProcess(payload);
};

const onRemoveProcess = async (ids) => {
  try {
    await store.bulkRemoveFeature(ids);
  } catch (error) {
    console.error(error.message);
  }
};

const onSave = async (payload) => {
  try {
    await store.saveFeature();
  } catch (error) {
    console.error(error.message);
  }
  state.isModalVisible = false;
};
</script>
