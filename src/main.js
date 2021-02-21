import { createApp } from 'vue';
import router from './router/index';
import App from './App.vue';
import BaseInput from './components/FormControls/BaseInput.vue';
import { iconComponents } from './composables/Icon.js';
import Icon from './components/Icon.vue';
import { confirmPromise } from './composables/Confirm.js';
import './assets/css/main.css';

const app = createApp(App);

app.use(router);

app.component('BaseInput', BaseInput);
app.component('Icon', Icon);

iconComponents.forEach((value, key) => {
  app.component(key, value);
});
app.provide('$confirm', confirmPromise);

app.mount('#app');
