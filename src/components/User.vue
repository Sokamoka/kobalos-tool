<template>
  <p class="text-xs text-gray-500">
    Sign in user
    <a :href="`mailto:${user.email}`" target="_blank" class="text-gray-500 font-semibold">
      {{ user.displayName }}
    </a>. <a href="#" @click.prevent="onSignOut">Sign Out</a>
  </p>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useStore } from '../store';
import { auth } from '../firebase';
import { TYPE_CONFIRM } from './Dialog/internal';

const notify = inject('notify');

const store = useStore();

const user = ref(store.user);

const onSignOut = async () => {
  const result = await notify({ type: TYPE_CONFIRM, title: 'You want to Sign out?', icon: 'help' });
  if (!result) return;
  try {
    await auth.signOut();
    store.signOut();
  } catch (error) {
    console.error(error);
  }
};
</script>
