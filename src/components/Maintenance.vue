<template>
  <div @click.prevent="onClick">
    <BaseSwitch v-model="isChecked" label="Maintenance"></BaseSwitch>
  </div>
</template>

<script setup>
import { computed, inject, onMounted } from 'vue';
import { maintenanceRef } from '../firebase';
import { useStore } from '../store';
import { TYPE_CONFIRM, TYPE_ERROR, TYPE_SUCCESS } from './Dialog/internal';
import BaseSwitch from './FormControls/BaseSwitch.vue';

const notify = inject('notify');

const store = useStore();

const isChecked = computed({
  get: () => store.maintenance.value,
  set: (value) => {
    onSetMaintenance(value);
  },
});

onMounted(async () => {
  maintenanceRef.on('value', (snapshot) => {
    // console.log('value:', snapshot.val());
    // isChecked.value = snapshot.val();
    store.setMaintenance(snapshot.val());
  });
});

const onClick = async () => {
  if (isChecked.value) return (isChecked.value = false);
  const result = await notify({ type: TYPE_CONFIRM, title: 'Are you sure?' });
  if (!result) return;
  isChecked.value = true;
};

const onSetMaintenance = async (value) => {
  try {
    await store.setMaintenanceRef(value);
    if (value) return notify({ type: TYPE_SUCCESS, title: 'You are in Maintenance mode', icon: 'check-circle' });
    notify({ type: TYPE_SUCCESS, title: 'Maintenance mode is over', icon: 'check-circle' });
  } catch (error) {
    notify({ type: TYPE_ERROR, title: error.message, icon: 'error' });
  }
};
</script>
