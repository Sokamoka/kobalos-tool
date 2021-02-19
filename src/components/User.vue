<template>
  <p class="text-xs text-gray-500">
    Sign in user <strong>{{ user.email }}</strong>. <a href="#" @click.prevent="onSignOut">Sign Out</a>
  </p>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "../store";
import { auth } from "../firebase";

const store = useStore();

const user = ref(store.user);

const onSignOut = async () => {
  try {
    await auth.signOut();
    store.SignOut();
  } catch (error) {
    console.error(error);
  }
}
</script>
