<template>
  <transition name="modal-fade">
    <div v-if="isVisible" :class="mainClasses">
      <div class="modal-background" @click.self="close"></div>
      <slot>
        <div class="modal-card">
          <slot name="header">
            <header v-if="header" class="modal-card-head">
              <p class="modal-card-title">{{ title }}</p>
              <button class="button is-icon is-flat" @click="close">
                <Icon name="clear" class="w-5 h-5"></Icon>
              </button>
            </header>
          </slot>
          <section class="modal-card-body">
            <slot name="content"></slot>
          </section>
          <footer v-if="footer" class="modal-card-foot">
            <slot name="footer">
              <button class="button is-primary" @click="close">Ok</button>
            </slot>
          </footer>
        </div>
      </slot>
      <button
        v-if="isContent"
        class="modal-close is-large"
        aria-label="close"
        @click="close"
      ></button>
    </div>
  </transition>
</template>
<script>
export default {
  name: "Modal",

  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },

    type: {
      type: String,
      default: "card",
    },

    title: {
      type: String,
    },

    size: {
      validator(value) {
        return ["xs", "sm", "md", "base", "lg"].includes(value);
      },
      default: "base",
    },

    header: {
      type: Boolean,
      default: false,
    },

    footer: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:modelValue"],

  computed: {
    isVisible() {
      return this.modelValue;
    },

    mainClasses() {
      return ["modal", [`is-${this.size}`], { "is-active": this.isVisible }];
    },

    contentClasses() {
      return {
        "modal-content": this.type === "content",
        "modal-card": this.type === "card",
      };
    },

    isContent() {
      return this.type === "content";
    },
  },

  methods: {
    close() {
      this.$emit("update:modelValue", !this.isVisible);
    },
  },
};
</script>

<style lang="scss" scoped>
.modal {
  @apply h-screen w-full fixed top-0 right-0 bottom-0 left-0 flex flex-col justify-center overflow-hidden items-center z-40;

  .modal-background {
    @apply h-screen w-full absolute left-0 top-0 bg-gray-900 bg-opacity-75 z-0;
  }

  .modal-card {
    @apply rounded-md shadow-lg bg-white z-10 overflow-hidden flex flex-col;
    width: 98%;
    max-height: calc(100vh - 40px);
  }

  .modal-card-head {
    @apply flex justify-between items-center border-b border-gray-300 px-5 py-7;
  }

  .modal-card-title {
    @apply font-bold text-gray-700 text-lg;
  }

  .modal-card-body {
    @apply px-10 py-5 text-gray-600 overflow-auto max-h-screen;
  }

  .modal-card-foot {
    @apply border-t border-gray-300 px-5 py-4 flex justify-end;
  }

  &.is-xs {
    .modal-card {
      max-width: 360px;
    }
  }

  &.is-sm {
    .modal-card {
      max-width: 560px;
    }
  }

  &.is-md {
    .modal-card {
      max-width: 760px;
    }
  }

  &.is-base {
    .modal-card {
      max-width: 1020px;
    }
  }

  &.is-lg {
    .modal-card {
      max-width: 1240px;
    }
  }
}

.modal-fade {
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
