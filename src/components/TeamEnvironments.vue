<template>
  <div class="container m-auto">
    <div class="flex flex-col bg-white rounded-lg shadow-lg">
      <div class="flex flex-col sm:flex-row p-7">
        <div class="mb-4 sm:mb-0 flex-grow">
          <h2 class="text-sm font-bold uppercase text-gray-900">
            Recent Environments List
          </h2>
          <p class="text-xs text-gray-500 font-medium">
            Showing <b>{{ total }}</b> environments
          </p>
        </div>
        <button class="button is-secondary is-xs sm:ml-3 mt-3 sm:mt-0" aria-label="New" @click="onAdd">
          <Icon name="add-circle" class="w-4 h-4 fill-current mr-1"></Icon>
          New
        </button>
      </div>
      <div class="relative w-full overflow-auto">
        <table>
          <thead>
            <tr>
              <th class="w-1 text-center">Drag</th>
              <th>Label</th>
              <th>Value</th>
              <th class="w-1 text-center">Action</th>
              <th class="w-1 text-center">Delete</th>
            </tr>
          </thead>
          <VueDraggableNext v-model="environmentsList" handle=".handle" tag="tbody" :disabled="false">
            <template v-for="env in environmentsList" :key="env.id">
              <Item :item="env" @remove="onRemove" @save="onSave"></Item>
            </template>
          </VueDraggableNext>
        </table>
        <div class="px-3 py-4">
          <a
            href="https://console.firebase.google.com/u/0/project/tyr-label-manager/database/tyr-label-manager/data"
            target="_blank"
            rel="noreferrer"
            class="button is-flat is-secondary"
          >
            Open firebase database
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next';
import { environmentsRef } from '../firebase';
import { useStore } from '../store';
import { TYPE_CONFIRM, TYPE_SUCCESS } from './Dialog/internal';
import Item from './TeamEnvironmentItem.vue';

const notify = inject('notify');

const store = useStore();

const total = computed(() => store.environments.value.length);

const environmentsList = computed({
  get: () => store.environments.value,
  set: (value) => {
    store.onEnvironmentsOrderChanged(value);
  },
});

onMounted(() => {
  console.log('MOUNTED');
  environmentsRef.on('value', (snapshot) => {
    const data = snapshot.val();
    store.setEnvironments(data);
  });
});

const onAdd = () => {
  store.addEnvironment();
};

const onSave = (payload) => {
  console.log(payload);
};

const onRemove = async (payload) => {
  const result = await notify({ type: TYPE_CONFIRM, title: 'Are you sure you want to delete?' });
  if (!result) return;
  try {
    await store.removeEnvironment(payload);
    notify({ type: TYPE_SUCCESS, title: 'Delete success', icon: 'check-circle' });
  } catch (error) {
    console.log(error);
  }
}
</script>

<style>
.handle {
  cursor: grab;
}
</style>
