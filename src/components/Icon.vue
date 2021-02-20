<template>
  <component :is="icon" v-bind="$attrs"></component>
</template>

<script setup>
import {
  defineProps,
  shallowRef,
  watchEffect,
} from "vue";

const props = defineProps({
  name: {
    type: String,
    default: "",
  },
});

const icon = shallowRef();

watchEffect(() => {
  // icon.value = iconComponents[props.name];
  icon.value = props.name;
});
</script>
