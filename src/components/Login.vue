<template>
  <div class="container m-auto">
    <div class="w-full sm:w-2/4 md:w-2/5 lg:w-2/6 p-6 bg-white m-auto rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold uppercase flex-grow">
        Sign in
      </h1>
      <p class="text-gray-500 text-sm mb-5">Kobalos Options Tool</p>
      <form @submit.prevent="onSubmit">
        <div class="mb-4">
          <BaseInput name="email" v-model="email" type="text" label="E-mail" :error="emailError" />
        </div>

        <div class="mb-6">
          <BaseInput name="password" v-model="password" type="password" label="Password" :error="passwordError" />
        </div>

        <div
          v-if="error"
          class="border border-pink-200 bg-pink-100 p-3 mb-3 rounded text-pink-500 text-sm font-semibold"
        >
          {{ error }}
        </div>

        <div>
          <button class="button is-secondary w-full" type="submit" :class="{ 'is-loading': isSubmitting }">
            Sign in
          </button>
        </div>
      </form>

      <hr />

      <div>
        <button class="button w-full" @click="onSignInWithMicrosoft">
          Sign in with Microsoft
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';
import { auth, provider } from '../firebase';
import { useStore } from '../store';

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    email: 'x-stegnera@wizzair.com',
    password: 'Abc123',
  },
});

const store = useStore();

const error = ref('');

const { value: email, errorMessage: emailError } = useField('email');
const { value: password, errorMessage: passwordError } = useField('password');

const onSubmit = handleSubmit(async (values) => {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(values.email, values.password);
    store.SignIn(userCredential.user);
  } catch (err) {
    console.error(err);
    error.value = err?.message;
  }
});

const onSignInWithMicrosoft = async () => {
  auth
    .signInWithPopup(provider)
    .then((result) => {
      // IdP data available in result.additionalUserInfo.profile.
      // ...

      /** @type {firebase.auth.OAuthCredential} */
      const credential = result.credential;

      // OAuth access and id tokens can also be retrieved:
      const accessToken = credential.accessToken;
      const idToken = credential.idToken;
    })
    .catch((error) => {
      // Handle error.
    });
};
</script>
