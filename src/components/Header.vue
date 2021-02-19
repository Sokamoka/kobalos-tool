<template>
  <div class="container flex flex-col sm:flex-row mb-5 items-center m-auto">
      <div class="flex-grow mb-5 sm:mb-0">
        <h1 class="text-3xl font-bold uppercase">
          Kobalos Options Tool
        </h1>
        <User />
      </div>
      <div>
        <router-link :to="{ name: 'Features' }" tag="button" class="button is-flat px-3">
          A/B Tests
        </router-link>
        <router-link :to="{ name: 'Login' }" tag="button" class="button is-flat ml-1 px-3">
          Site settings
        </router-link>
      </div>
    </div>
</template>

<script setup>
import User from "./User.vue";
</script>

<style>
.button.router-link-active.is-flat{
  @apply text-indigo-700 bg-transparent hover:bg-indigo-100 focus:ring-transparent;
}
</style>
