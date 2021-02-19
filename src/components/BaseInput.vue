<template>
  <div class="input">
    <slot name="before"></slot>
    <input
      :value="modelValue"
      v-bind="$attrs"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <slot name="after"></slot>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',

  props: {
    modelValue: {
      type: [Number, String],
      default: ''
    },
  },

}
</script>
