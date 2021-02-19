import { reactive } from "vue";

export const store = {
  debug: false,

  state: reactive({
    user: {},
  }),

  SignIn(newValue) {
    if (this.debug) {
      console.log("SignIn", newValue);
    }

    this.state.user = newValue;
  },

  SignOut() {
    if (this.debug) {
      console.log("SignOut");
    }

    this.state.user = {};
  },
};
