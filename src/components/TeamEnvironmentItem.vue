<template>
  <tr>
    <td>
      <button class="handle button is-icon is-flat hover:bg-transparent" aria-label="drag">
        <Icon name="drag" class="w-6 h-6"></Icon>
      </button>
    </td>
    <td>
      <div :contenteditable="state.isEditActive" class="overflow-scroll p-2 font-semibold">
        {{ item.label }}
      </div>
    </td>
    <td>
      <div :contenteditable="state.isEditActive" class="overflow-scroll p-2">
        {{ item.value }}
      </div>
    </td>
    <td>
      <button v-if="state.isEditActive" class="button is-icon is-flat" aria-label="Save" @click="onSave">
        <Icon name="save" class="w-6 h-6 fill-current" />
      </button>
      <button v-else class="button is-icon is-flat" aria-label="Edit" @click="onEdit">
        <Icon name="create" class="w-6 h-6 fill-current" />
      </button>
    </td>
    <td>
      <button class="button is-icon is-flat" aria-label="Delete" @click="onRemove">
        <Icon name="delete" class="w-6 h-6 fill-current" />
      </button>
    </td>
  </tr>
</template>

<script setup>
import { defineProps, reactive } from 'vue';

const emit = defineEmit(['save', 'edit', 'remove']);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const state = reactive({
  isEditActive: props.item.isNew,
});

const onEdit = () => {
  state.isEditActive = true;
  emit('edit');
};

const onSave = () => {
  emit('save');
};

const onRemove = () => {
  emit('remove', props.item);
};
</script>

<style scoped>
[contenteditable='true'] {
  @apply bg-gray-100 border border-gray-400;
}

[contenteditable='true']:active,
[contenteditable='true']:focus {
  outline: none;
}
</style>
