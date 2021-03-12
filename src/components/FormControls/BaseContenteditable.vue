<template>
  <div @input="onInput" v-text="modelValue"></div>
</template>

<script>
import { toRef } from 'vue';

const BaseContenteditable = {
  emits: ['update:modelValue'],

  props: {
    modelValue: {
      type: String,
      default: ''
    }
  },

  setup(props) {
    const modelValue = toRef(props, 'modelValue');

    return {
      modelValue
    }
  },

  methods: {
    onInput(event) {
      this.$emit('update:modelValue', event.target.innerHTML);
    }
  }
}
export default BaseContenteditable;
</script>
