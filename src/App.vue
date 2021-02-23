<template>
  <div class="w-screen p-10">
    <Header v-if="isHeaderVisible" />
    <router-view></router-view>
    <ConfirmDialog></ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from './store';
import Header from './components/Header.vue';
import ConfirmDialog from './components/ConfirmDialog.vue';

const store = useStore();
const route = useRoute();

const isHeaderVisible = ref(store.isSignIn);

watch(
  () => route.meta,
  (to) => (document.title = to.title || import.meta.env.VITE_TITLE)
);
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

body {
  @apply bg-gray-100 h-screen;
}
#app {
  font-family: Inter, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
