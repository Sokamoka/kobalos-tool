<template>
  <transition name="dialog-fade">
    <div
      v-if="isVisible"
      class="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center"
    >
      <div
        class="bg-pink-600 text-white py-3 px-5 m-5 rounded shadow-lg font-semibold text-sm leading-loose"
      >
        <span>{{ dialog.title }}</span>
        <a
          href="#"
          class="text-sm text-pink-200 hover:text-white px-3 font-semibold"
          @click.prevent="onConfirm"
        >
          {{ dialog.confirmText }}
        </a>
        <a
          href="#"
          class="text-sm text-pink-200 hover:text-white px-3 font-semibold"
          @click.prevent="onCancel"
        >
          {{ dialog.cancelText }}
        </a>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive } from "vue";
import emitter from "tiny-emitter/instance";

let isVisible = ref(false);
let dialog = ref({});

emitter.on("add", function (payload) {
  console.log(payload);
  dialog.value = payload;
  isVisible.value = true;
});

const onConfirm = () => {
  console.log("CONFIRM:", dialog);
  isVisible.value = false;
  dialog.value.cb(true);
};

const onCancel = () => {
  console.log("onCancel");
  isVisible.value = false;
  dialog.value.cb(false);
};
</script>

<style lang="scss" scoped>
.dialog-fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.2s ease-in-out;
  }
  &-enter-from,
  &-leave-to {
    opacity: 0;
  }
}
</style>
