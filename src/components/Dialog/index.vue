<template>
  <transition name="dialog-fade">
    <div v-if="isConfirm && isVisible" class="curtain fixed top-0 left-0 right-0 bottom-0 "></div>
  </transition>
  <transition name="dialog-fade">
    <div v-if="isVisible" class="fixed top-0 left-1/2 flex flex-col items-center z-50 transform -translate-x-1/2">
      <div :class="notificationClasses">
        <div class="flex flex-nowrap items-center">
          <Icon :name="dialog.icon" class="w-5 h-5 fill-current mr-3 opacity-90" />
          <span class="mr-2">{{ dialog.title }}</span>
        </div>
        <a
          v-if="isConfirm"
          href="#"
          class="button is-flat ml-2"
          @click.prevent="onConfirm"
        >
          {{ dialog.confirmText }}
        </a>
        <a
          href="#"
          class="button is-icon is-flat is-xs ml-2"
          @click.prevent="onCancel"
        >
          <Icon name="clear" class="w-4 h-4" fill="currentColor" />
        </a>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue';
import emitter from 'tiny-emitter/instance';
import { TYPE_CONFIRM, TYPE_ERROR, TYPE_SUCCESS } from './internal.js';

const isVisible = ref(false);
const dialog = ref({});

let timeoutId = null;

const notificationClasses = computed(() => {
  return [
    'notification-container',
    { 'is-confirm': isConfirm.value },
    { 'is-success': dialog.value.type === TYPE_SUCCESS },
    { 'is-error': dialog.value.type === TYPE_ERROR },
  ];
});

const isConfirm = computed(() => dialog.value.type === TYPE_CONFIRM);

emitter.on('add', function (payload) {
  clearTimeout(timeoutId);
  dialog.value = payload;
  isVisible.value = true;
  if (payload.type !== TYPE_CONFIRM) {
    timeoutId = hideInterval(payload.duration);
  } 
});

const onConfirm = () => {
  isVisible.value = false;
  dialog.value.cb(true);
};

const onCancel = () => {
  isVisible.value = false;
  if (!isConfirm.value) {
    clearTimeout(timeoutId);
    return;
  }
  dialog.value.cb(false);
};

const hideInterval = (duration) => setTimeout(() => isVisible.value = false, duration);
</script>

<style lang="scss" scoped>
.curtain {
  backdrop-filter: blur(2px);
}

.notification-container {
  @apply flex flex-wrap sm:flex-nowrap flex-row items-center text-white py-2 px-4 mt-5 bg-gray-900 rounded shadow-lg font-semibold text-sm leading-loose z-10 whitespace-nowrap;

  .button {
    @apply text-sm px-4 h-8 text-gray-300 hover:text-white hover:bg-gray-600;
  }
 
  &.is-confirm {
    @apply bg-pink-600 text-sm;

    .button {
      @apply text-pink-300 hover:text-white hover:bg-pink-500;
    }
  }

  &.is-success {
    @apply bg-green-600 text-sm;

    .button {
      @apply text-green-300 hover:text-white hover:bg-green-500;
    }
  }

  &.is-error {
    @apply bg-red-a400 text-sm;

    .button {
      @apply text-red-300 hover:text-white hover:bg-red-a200;
    }
  }
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
