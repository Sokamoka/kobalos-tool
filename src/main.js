import { createApp } from "vue";
import router from "./router/index";
import App from "./App.vue";
import BaseInput from "./components/BaseInput.vue";
import { iconNames } from "./composables/Icon.js";
import Icon from "./components/Icon.vue";
import "./assets/css/main.css";

const app = createApp(App);

app.use(router);

app.component("BaseInput", BaseInput);
app.component("Icon", Icon);

iconNames.forEach((value, key) => {
  console.log(value, key);
  app.component(key, value);
});

app.mount("#app");
