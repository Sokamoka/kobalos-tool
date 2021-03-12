<template>
  <label v-if="label" :for="name" class="mb-1">{{ label }}</label>
  <div :class="mainClasses">
    <slot name="before"></slot>
    <input
      :id="name"
      :name="name"
      :value="inputValue"
      v-bind="$attrs"
      @input="onInputChange($event)"
      @blur="handleBlur"
    />
    <slot name="after"></slot>
  </div>
  <p v-if="errorMessage" class="mt-2 text-xs text-red-a400 font-semibold uppercase">{{ errorMessage }}</p>
</template>

<script>
import { useField } from 'vee-validate';
import { toRef } from 'vue';

const BaseInput = {
  name: 'BaseInput',

  emits: ['update:modelValue'],

  props: {
    modelValue: {
      type: [Number, String],
      default: '',
    },

    label: {
      type: String,
      default: '',
    },

    size: {
      type: String,
      validator: (value) => ['xs', 'md'].includes(value),
      default: 'md',
    },

    name: {
      type: String,
      required: true,
    },
  },

  setup(props) {
    const modelValue = toRef(props, 'modelValue');

    const { value: inputValue, errorMessage, handleBlur, handleInput, meta } = useField(props.name, undefined, {
      initialValue: modelValue.value,
    });

    return {
      modelValue,
      handleInput,
      handleBlur,
      errorMessage,
      inputValue,
      meta,
    };
  },

  computed: {
    mainClasses() {
      return ['input', [`is-${this.size}`], { 'is-error': this.errorMessage, 'is-valid': this.meta.valid }];
    },
  },

  watch: {
    modelValue(modelValue) {
      if (modelValue !== this.inputValue) {
        this.inputValue = modelValue;
      }
    },
  },

  methods: {
    onInputChange(event) {
      this.handleInput(event);
      this.$emit('update:modelValue', event.target.value);
    },
  },
};
export default BaseInput;
</script>
