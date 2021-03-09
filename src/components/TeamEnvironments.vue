<template>
  <div class="container m-auto">
    <div class="flex flex-col bg-white rounded-lg shadow-lg">
      <div class="p-7">
        <div class="mb-4 sm:mb-0 flex-grow">
          <h2 class="text-sm font-bold uppercase text-gray-900">
            Recent Environments List
          </h2>
          <p class="text-xs text-gray-500 font-medium">Showing <b>5</b> of <b>5</b> environments</p>
        </div>
      </div>
      <div class="relative w-full overflow-auto">
        <table>
          <thead>
            <tr>
              <th>Drag</th>
              <th>Label</th>
              <th>Value</th>
              <th>Action</th>
              <th>Delete</th>
            </tr>
          </thead>
          <VueDraggableNext v-model="environmentsList" handle=".handle" tag="tbody">
            <tr v-for="env in environmentsList" :key="env.id">
              <td>
                <Icon name="drag" class="handle w-6 h-6"></Icon>
              </td>
              <td>{{ env.label }}</td>
              <td>{{ env.value }}</td>
              <td>Edit/save</td>
              <td>Delete</td>
            </tr>
          </VueDraggableNext>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';
import { VueDraggableNext } from 'vue-draggable-next'
import { db, environmentsRef } from '../firebase';
import { useStore } from '../store';

const store = useStore();

const state = reactive({
  environments: store.environments,
});

const environmentsList = computed({
  get: () => store.environments.value,
  set: (value) => {
    store.setEnvironments(value);
  },
});

onMounted(() => {
  console.log('MOUNTED');
  environmentsRef.on('value', (snapshot) => {
    const data = snapshot.val();
    store.setEnvironments(data);
  });
});
</script>

<style scoped>
.handle {
  cursor: grab;
}
</style>
