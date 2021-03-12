<template>
  <label class="switch-container">
    <input
      v-bind="$attrs"
      class="input"
      type="checkbox"
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="switch"></span>
    <span class="label">{{ label }}</span>
  </label>
</template>

<script>
import { toRef } from '@vue/reactivity';
export default {
  name: 'Switch',

  inheritAttrs: false,

  props: {
    label: {
      type: String,
      required: true,
    },

    modelValue: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style scoped>
.switch-container {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.label {
  @apply text-gray-800;
  margin-left: 8px;
  text-transform: capitalize;
  /* overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; */
}

.input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.switch {
  --switch-container-width: 32px;
  --switch-size: calc(var(--switch-container-width) / 2);
  --light-gray: theme(colors.gray.300);
  --gray: theme(colors.gray.400);
  --dark-gray: theme(colors.gray.500);
  --color: theme(colors.indigo.500);
  --dark-color: theme(colors.indigo.600);

  display: flex;
  flex-shrink: 0;
  align-items: center;
  position: relative;
  height: var(--switch-size);
  /* flex-basis: var(--switch-container-width); */
  width: var(--switch-container-width);
  border-radius: var(--switch-size);
  background-color: var(--light-gray);
  transition: background-color 0.25s ease-in-out;
}

.switch::before {
  content: '';
  position: absolute;
  left: 2px;
  height: calc(var(--switch-size) - 4px);
  width: calc(var(--switch-size) - 4px);
  border-radius: 9999px;
  /* border: 2px solid var(--light-gray); */
  background-color: white;
  transition: transform 0.275s ease-in-out;
}

.input:checked + .switch {
  background-color: var(--color);
}

.input:checked + .switch::before {
  border-color: var(--color);
  transform: translateX(calc(var(--switch-container-width) - var(--switch-size)));
}
.input:focus + .switch::before {
  border-color: var(--dark-gray);
}

.input:focus:checked + .switch::before {
  border-color: var(--dark-color);
}

.input:disabled + .switch {
  background-color: var(--gray);
}

.input:disabled + .switch::before {
  background-color: var(--dark-gray);
  border-color: var(--dark-gray);
}
</style>
