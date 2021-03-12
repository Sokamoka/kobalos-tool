<template>
  <div class="container flex flex-col lg:flex-row mb-5 lg:items-center m-auto">
      <div class="flex-grow mb-5 lg:mb-0">
        <h1 class="text-3xl font-bold uppercase">
          {{ title }}
        </h1>
        <User />
      </div>
      <div class="flex flex-wrap items-center justify-end">
        <Maintenance class="button is-flat px-3 cursor-pointer" />
        <router-link :to="{ name: 'Features' }" tag="button" class="button ml-1 is-flat px-3">
          A/B Tests
        </router-link>
        <router-link :to="{ name: 'Settings' }" tag="button" class="button is-flat ml-1 px-3">
          Site settings
        </router-link>
        <router-link :to="{ name: 'Environments' }" tag="button" class="button is-flat ml-1 px-3">
          Team environments
        </router-link>
      </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import User from "./User.vue";
import Maintenance from './Maintenance.vue';

const title = ref(import.meta.env.VITE_TITLE);
</script>

<style>
.button.router-link-active.is-flat{
  @apply text-indigo-700 bg-transparent hover:bg-indigo-100 focus:ring-transparent;
}
</style>
