<template>
  <label v-if="label" :for="name" class="mb-1">{{ label }}</label>
  <div :class="mainClasses">
    <div
      v-for="(item, index) in inputValue"
      :key="item"
      :data-index="index"
      class="tag is-primary my-2 mr-1 pr-2 flex flex-row items-center"
    >
      {{ item }}
      <Icon name="remove-circle" class="w-5 h-5 fill-current ml-1 cursor-pointer" @click.passive="onRemove(item)" />
    </div>
    <input
      v-model="variant"
      type="text"
      class="flex-1 flex-shrink-0 min-w-max py-3"
      v-bind="$attrs"
      @change="onChange($event.target.value)"
      @input="onInput"
    />
  </div>
  <p v-if="errorMessage" class="mt-2 text-xs text-red-a400 font-semibold uppercase">{{ errorMessage }}</p>
</template>

<script>
import { useField } from 'vee-validate';
import { equalityIndicatorClass } from './internal';

export default {
  emits: ['update:modelValue'],

  props: {
    modelValue: {
      type: Array,
      default: () => [],
    },

    name: {
      type: String,
      required: true,
    },

    size: {
      type: String,
      validator: (value) => ['xs', 'md'].includes(value),
      default: 'md',
    },

    label: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      variant: '',
    };
  },

  setup(props) {
    const { value: inputValue, errorMessage, handleChange, meta } = useField(props.name, undefined, {
      initialValue: props.modelValue,
    });

    return {
      handleChange,
      errorMessage,
      inputValue,
      meta,
    };
  },

  computed: {
    mainClasses() {
      return [
        'input flex flex-wrap h-auto',
        [`is-${this.size}`],
        { 'is-error': this.errorMessage, 'is-valid': this.meta.valid },
      ];
    },
  },

  methods: {
    onRemove(value) {
      const index = this.inputValue.indexOf(value);
      this.inputValue.splice(index, 1);
      this.$emit('update:modelValue', this.inputValue);
    },

    onChange(value) {
      if (!value) return;
      const index = this.inputValue.indexOf(value);
      if (index >= 0) {
        equalityIndicatorClass(this.$el, index).add();
        return;
      }
      this.inputValue.push(value);
      this.$emit('update:modelValue', this.inputValue);
      this.variant = '';
    },

    onInput() {
      equalityIndicatorClass(this.$el).remove();
    }
  },
};
</script>
