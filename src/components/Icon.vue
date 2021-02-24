<template>
  <i class="inline-block">
    <component :is="componentFile" />
  </i>
</template>

<script setup>
import { computed, defineAsyncComponent, defineProps } from "vue";

const props =  defineProps({
  name: {
    type: String,
    required: true
  }
});

const componentFile = computed(()=> defineAsyncComponent( () => import(`../assets/svgs/${props.name}.svg`)));
</script>
