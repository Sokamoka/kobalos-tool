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

const FeatureModal = defineAsyncComponent(() => import('./FeatureModal.vue'));
const FeatureList = defineAsyncComponent(() => import('./FeatureList.vue'));
const BaseTagInput = defineAsyncComponent(() => import('../FormControls/BaseTagInput.vue'));

const confirm = inject('$confirm');

const state = reactive({
  isLoading: false,
  isModalVisible: false,
  feature: {
    id: null,
    title: '',
    name: '',
    variants: [],
  },
  features: {},
});

onMounted(async () => {
  state.isLoading = true;
  const snapshot = await featuresRef.once('value');
  state.isLoading = false;
  // state.features = snapshot.val();

  featuresRef.on('value', (snapshot) => {
    const data = snapshot.val();
    state.features = data;
  });
});

function onClickAddNew() {
  state.feature = {
    id: null,
    title: '',
    name: '',
    variants: [],
  };
  state.isModalVisible = true;
}

function onEdit(payload) {
  state.feature = {
    id: payload.key,
    title: payload.title,
    name: payload.name,
    variants: Object.keys(payload.matrices).map((key) => payload.matrices[key].name),
  };
  state.isModalVisible = true;
}

const onModalRemove = async (key) => {
  const result = await confirm({ title: 'Are you sure you want to delete?' });
  if (!result) return;
  onRemove({ key });
  state.isModalVisible = false;
};

const onRemove = async (payload) => {
  try {
    await db.ref(`kobalos/features/${payload.key}`).remove();
  } catch (error) {
    console.error(error);
  }
};

const onBulkRemove = async (payload) => {
  const deleted = {};
  payload.forEach((item) => {
    deleted[`kobalos/features/${item.key}`] = null;
  });

  try {
    await db.ref().update(deleted);
  } catch (error) {
    console.error(error);
  }
};

const onSave = async (payload) => {
  const matrices = payload.variants.map((item) => ({
    id: nanoid(6),
    name: item,
    checked: false,
  }));
  const newFeature = {
    title: payload.title,
    name: payload.name,
    matrices,
  };

  if (payload.id) {
    await db.ref(`kobalos/features/${payload.id}`).update(newFeature);
  } else {
    await featuresRef.push(newFeature);
  }
  state.isModalVisible = false;
};
</script>
