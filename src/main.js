import { createApp } from 'vue';
import router from './router/index';
import App from './App.vue';
import BaseInput from './components/FormControls/BaseInput.vue';
import Icon from './components/Icon.vue';
import { notification } from './components/Dialog/internal.js';
import './assets/css/main.css';

const app = createApp(App);

app.use(router);

app.component('BaseInput', BaseInput);
app.component('Icon', Icon);

app.provide('notify', notification);

app.mount('#app');
