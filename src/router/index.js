import { createRouter, createWebHashHistory } from "vue-router";
import { auth } from "../firebase";
import Login from "../components/Login.vue";
import Features from "../components/Features.vue";

const routes = [
  { path: "/", name: "Login", component: Login },
  { path: "/features", name: "Features", component: Features },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

auth.onAuthStateChanged((user) => {
  // console.log(user);
  if (user) {
    return router.push({ name: "Features" });
  }
  router.push({ name: "Login" });
});

export default router;
