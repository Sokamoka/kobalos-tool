<template>
  <div class="container flex flex-col sm:flex-row mb-5 items-center m-auto">
      <div class="flex-grow mb-5 sm:mb-0">
        <h1 class="text-3xl font-bold uppercase">
          Kobalos Options Tool
        </h1>
        <User />
      </div>
      <div>
        <router-link :to="{ name: 'Features' }" tag="button" class="button is-flat">
          A/B Tests
        </router-link>
        <router-link :to="{ name: 'Login' }" tag="button" class="button is-flat ml-1">
          Site settings
        </router-link>
      </div>
    </div>
</template>

<script setup>
import User from "./User.vue";
</script>

<style>
.button.router-link-active {
  @apply text-indigo-700 bg-indigo-100 hover:bg-indigo-100 focus:ring-indigo-200;
}
</style>
