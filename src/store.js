import { reactive, computed, watch } from "vue";
const storeName = "kobalos-user-store";

const state = reactive(
  localStorage.getItem(storeName)
    ? JSON.parse(localStorage.getItem(storeName))
    : {
        user: {},
      }
);
watch(state, (value) => localStorage.setItem(storeName, JSON.stringify(value)));

export const useStore = () => ({
  debug: false,

  user: computed(() => state.user),

  SignIn(newValue) {
    if (this.debug) {
      console.log("SignIn", newValue);
    }

    state.user = newValue;
  },

  SignOut() {
    if (this.debug) {
      console.log("SignOut");
    }

    state.user = {};
  },
});
