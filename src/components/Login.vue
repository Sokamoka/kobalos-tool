<template>
  <div class="container m-auto">
    <div
      class="w-full sm:w-2/4 md:w-2/5 lg:w-2/6 p-6 bg-white m-auto rounded-lg shadow-lg"
    >
      <h1 class="text-3xl font-bold uppercase flex-grow">
        Sign in
      </h1>
      <p class="text-gray-500 text-sm mb-5">Kobalos Options Tool</p>
      <div class="mb-4">
        <label class="block mb-1">Name (E-mail)</label>
        <BaseInput v-model="state.userName" type="text" />
      </div>

      <div class="mb-8">
        <label class="block mb-1">Password</label>
        <BaseInput v-model="state.password" type="password" />
      </div>

      <div>
        <button
          class="button is-secondary w-full"
          :class="{ 'is-loading': state.isLoading }"
          @click="onSignIn"
        >
          Sign in
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";
import { auth } from "../firebase";
import { useStore } from "../store";

const store = useStore();

const state = reactive({
  isLoading: false,
  userName: "x-stegnera@wizzair.com",
  password: "Abc123",
});

const onSignIn = async () => {
  try {
    state.isLoading = true;
    const userCredential = await auth.signInWithEmailAndPassword(
      state.userName,
      state.password
    );
    state.isLoading = false;
    const user = userCredential.user;
    store.SignIn(user);
  } catch (error) {
    console.error(error);
  }
};
</script>
