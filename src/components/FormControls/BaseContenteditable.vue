<template>
  <div @input="onInput" v-text="modelValue" @paste.prevent="onPaste"></div>
</template>

<script>
const BaseContenteditable = {
  emits: ['update:modelValue'],

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  methods: {
    onInput(event) {
      this.$emit('update:modelValue', event.target.innerText);
    },

    onPaste(event) {
      const clipboardData = event.clipboardData || window.clipboardData;
      const pastedData = clipboardData.getData('text/plain');
      document.execCommand('insertHTML', false, pastedData);
    },
  },
};
export default BaseContenteditable;
</script>
