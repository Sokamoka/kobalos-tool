<template>
  <div class="input flex flex-wrap h-auto">
    <div
      v-for="item in modelValue"
      :key="item"
      class="tag my-2 mr-1 pr-2 flex flex-row items-center"
    >
      {{ item }}
      <Icon
        name="remove-circle"
        class="w-5 h-5 fill-current ml-1 cursor-pointer"
        @click.passive="onRemove(item)"
      />
    </div>
    <input
      v-model="variant"
      type="text"
      class="flex-1 flex-shrink-0 min-w-max py-3"
      v-bind="$attrs"
      @change="onChange($event.target.value)"
    />
  </div>
</template>

<script>
export default {
  emits: {
    add: (value) => {
      if (value) {
        return true
      } 
      return false
    },

    remove: (value) => {
      if (value) {
        return true
      } 
      return false
    }
  },

  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
  },

  data() {
    return {
      variant: ''
    }
  },

  methods: {
    onRemove(value) {
      this.$emit('remove', value);
    },

    onChange(value) {
      if (this.modelValue.indexOf(value) >= 0) return;
      this.$emit('add', value);
      this.variant = ''; 
    }
  }
}
</script>
