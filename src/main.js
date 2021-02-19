import { createApp } from "vue";
import router from "./router/index";
import App from "./App.vue";
import BaseInput from "./components/BaseInput.vue";
import "./assets/css/main.css";

const app = createApp(App);

app.use(router);

app.component("BaseInput", BaseInput);

app.mount("#app");
