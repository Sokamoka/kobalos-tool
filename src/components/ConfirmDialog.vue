<template>
  <transition name="dialog-fade">
    <div
      v-if="isVisible"
      class="fixed top-0 left-0 right-0 bottom-0 flex flex-col items-center"
    >
      <div class="curtain"></div>
      <div
        class="flex flex-wrap flex-row items-center bg-pink-600 text-white py-3 px-5 m-5 rounded shadow-lg font-semibold text-sm leading-loose z-10"
      >
        <Icon name="delete" class="w-5 h-5 fill-current mr-3 text-pink-200" />
        <span class="mr-2">{{ dialog.title }}</span>
        <a
          href="#"
          class="text-sm text-pink-200 hover:text-white px-3 py-2 mx-2 font-semibold hover:bg-pink-500 rounded"
          @click.prevent="onConfirm"
        >
          {{ dialog.confirmText }}
        </a>
        <a
          href="#"
          class="text-sm text-pink-200 hover:text-white px-3 py-2 font-semibold hover:bg-pink-500 rounded"
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
  dialog.value = payload;
  isVisible.value = true;
});

const onConfirm = () => {
  isVisible.value = false;
  dialog.value.cb(true);
};

const onCancel = () => {
  isVisible.value = false;
  dialog.value.cb(false);
};
</script>

<style lang="scss" scoped>
.curtain {
  @apply h-screen w-full absolute left-0 top-0 z-0;
  backdrop-filter: blur(2px);
}

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
