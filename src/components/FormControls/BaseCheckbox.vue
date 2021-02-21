<template>
  <input
    ref="cb"
    type="checkbox"
    :checked="modelValue"
    @change="$emit('update:modelValue', $event.target.checked)"
    :class="mainClasses"
  />
  <label v-if="label">{{ label }}</label>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },

    modelValue: {
      type: Boolean,
      default: false,
    },

    intermediate: {
      type: Boolean,
      default: false,
    }
  },
  
  computed: {
    mainClasses() {
      return {
        'intermediate': this.intermediate
      }
    }
  }


};
</script>

<style scoped>
input[type="checkbox"] {
  @apply w-3 h-3 bg-white border border-gray-400 rounded-sm relative align-middle appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-75;
}

input[type="checkbox"].intermediate {
  @apply bg-indigo-200 border-indigo-300;
}

input[type="checkbox"]:checked {
  @apply bg-indigo-500 border-indigo-700;
}
</style>
