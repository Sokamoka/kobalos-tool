<template>
  <div class="container m-auto">
    <div class="flex flex-col bg-white rounded-lg shadow-lg">
      <FeatureList
        :features="state.features"
        :is-loading="state.isLoading"
        @edit="onEdit"
        @remove="onRemove"
        @add="onClickAddNew"
      />
    </div>
  </div>

  <FeatureModal v-model="state.isModalVisible" :feature="state.feature" @save="onSave" @remove="onRemove" />

</template>

<script setup>
import { defineAsyncComponent, inject, onMounted, reactive } from 'vue';
import { featuresRef } from '../../firebase';
import { useStore } from '../../store';
import useSelection from '../../composables/UseSelection';

const FeatureModal = defineAsyncComponent(() => import('./FeatureModal.vue'));
const FeatureList = defineAsyncComponent(() => import('./FeatureList.vue'));
const BaseTagInput = defineAsyncComponent(() => import('../FormControls/BaseTagInput.vue'));

const notify = inject('notify');

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

const onRemove = async (payload) => {
  const result = await notify({ type: 'confirm', title: 'Are you sure you want to delete?' });
  if (!result) return;
  state.isModalVisible = false;
  onRemoveProcess(new Set(payload.selected));
  if (payload.clear) payload.clear();
};

const onRemoveProcess = async (ids) => {
  try {
    await store.bulkRemoveFeature(ids);
    notify({ type: 'success', title: 'Delete success', icon: 'check-circle' });
  } catch (error) {
    notify({ type: 'error', title: error.message, icon: 'error'});
  }
};

const onSave = async (payload) => {
  try {
    await store.saveFeature();
    notify({ type: 'success', title: 'Save success', icon: 'check-circle' });
  } catch (error) {
    notify({ type: 'error', title: error.message, icon: 'error'});
  } finally {
    state.isModalVisible = false;
  }
};
</script>
