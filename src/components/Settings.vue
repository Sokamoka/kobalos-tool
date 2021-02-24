<template>
    <div class="container m-auto">
    <div class="bg-white rounded-lg shadow-lg">
      <SettingList :settings="state.settings" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import { useStore } from '../store';
import SettingList from './SettingsList.vue';

const store = useStore();

const state = reactive({
  settings: store.settings
})

onMounted(async () => {
  console.log("MOUNTED");
  store.getSettings();
});
</script>
