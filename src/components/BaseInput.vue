<template>
  <label v-if="label" class="mb-1">{{ label }}</label>
  <div :class="mainClasses">
    <slot name="before"></slot>
    <input :value="modelValue" v-bind="$attrs" @input="$emit('update:modelValue', $event.target.value)" />
    <slot name="after"></slot>
  </div>
  <p v-if="error" class="mt-2 text-xs text-red-500 font-semibold uppercase">{{ error }}</p>
</template>

<script>
export default {
  name: 'BaseInput',

  props: {
    modelValue: {
      type: [Number, String],
      default: '',
    },

    label: {
      type: String,
      default: '',
    },

    error: {
      type: String,
      default: '',
    },

    size: {
      type: String,
      validator: value => ['xs', 'md'].includes(value),
      default: 'md'
    },
  },

  computed: {
    mainClasses() {
      return ['input', [`is-${this.size}`], { 'is-error': this.error }];
    },
  },
};
</script>
