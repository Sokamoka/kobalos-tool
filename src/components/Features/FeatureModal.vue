<template>
  <Modal v-model="isVisible" :title="modalTitle" size="sm" header footer>
    <template v-slot:content>
      <form>
        <div class="mb-4">
          <BaseInput name="title" v-model="props.feature.title" type="text" label="Title" />
        </div>

        <div class="mb-4">
          <BaseInput name="name" v-model="props.feature.name" type="text" label="Name" />
        </div>

        <div class="mb-4">
          <BaseTagInput
            name="variants"
            v-model="props.feature.variants"
            label="Variants"
            placeholder="Add new variant..."
          ></BaseTagInput>
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <div v-if="feature.id" class="flex-grow">
        <button class="button" @click="onRemove">
          <Icon name="delete" class="w-5 h-5 fill-current mr-1" />
          Delete
        </button>
      </div>

      <button class="button is-primary" @click="onSubmit">
        <Icon name="save" class="w-5 h-5 fill-current mr-1" />
        Save
      </button>
    </template>
  </Modal>
</template>

<script setup>
import { computed, defineProps, markRaw } from 'vue';
import { useForm } from 'vee-validate';
import { object, string, array } from 'yup';
import Modal from '../Modal.vue';
import BaseTagInput from '../FormControls/BaseTagInput.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },

  feature: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmit(['save', 'remove', 'update:modelValue']);

const modalTitle = computed(() => (props.feature.id ? 'Edit feature' : 'Add new feature'));

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const schema = markRaw(
  object({
    title: string().required(),
    name: string().required(),
    variants: array().min(2),
  })
);

const { handleSubmit, meta } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit((values) => {
  const payload = {
    ...props.feature,
    title: values.title,
    name: values.name,
    variants: values.variants,
  };
  emit('save', payload);
});

const onRemove = () => {
  emit('remove', props.feature.id);
};
</script>
