<template>
  <Modal v-model="isVisible" :title="modalTitle" size="sm" header footer>
    <template v-slot:content>
      <form>
        <div class="mb-4">
          <BaseInput name="title" v-model="manageFeatureTitle" type="text" label="Title" />
        </div>

        <div class="mb-4">
          <BaseInput name="name" v-model="manageFeatureName" type="text" label="Name" />
        </div>

        <div class="mb-4">
          <BaseTagInput
            name="variants"
            v-model="manageFeatureVariants"
            label="Variants"
            placeholder="Add new variant..."
          ></BaseTagInput>
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <div v-if="manageFeatureId" class="flex-grow">
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
import { useStore } from '../../store';
import Modal from '../Modal.vue';
import BaseTagInput from '../FormControls/BaseTagInput.vue';

const store = useStore();

const emit = defineEmit(['save', 'remove', 'update:modelValue']);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const manageFeatureId = computed(() => store.manageFeatureId.value);

const manageFeatureTitle = computed({
  get: () => store.manageFeatureTitle.value,
  set: (value) => {
    store.setManageFeatureTitle(value);
  },
});

const manageFeatureName = computed({
  get: () => store.manageFeatureName.value,
  set: (value) => {
    store.setManageFeatureName(value);
  },
});

const manageFeatureVariants = computed({
  get: () => store.manageFeatureVariants.value,
  set: (value) => {
    store.setManageFeatureVariants(value);
  },
});

const modalTitle = computed(() => (manageFeatureId.value ? 'Edit feature' : 'Add new feature'));

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
  emit('save');
});

const onRemove = () => {
  emit('remove', manageFeatureId.value);
};
</script>
