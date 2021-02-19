<template>
  <p class="text-xs text-gray-500">
    Sign in user <strong>{{ user.email }}</strong>. <a href="#" @click.prevent="onSignOut">Sign Out</a>
  </p>
</template>

<script setup>
import { ref } from "vue";
import { store } from "../store";
import { auth } from "../firebase";

const user = ref(store.state.user);

const onSignOut = async () => {
  try {
    await auth.signOut();
    store.SignOut();
  } catch (error) {
    console.error(error);
  }
}
</script>
