<template>
  <Modal v-model="isVisible" :title="modalTitle" size="sm" header footer>
    <template v-slot:content>
      <form>
        <div class="mb-4">
          <BaseInput name="label" v-model="manageSettingLabel" type="text" label="Label" />
        </div>

        <div class="mb-4">
          <BaseInput name="key" v-model="manageSettingKey" type="text" label="Key" />
        </div>

        <div class="mb-4">
          <label class="mb-0">Labels for switcher</label>
          <p class="text-xs font-medium text-gray-400 mb-1">Example: Off / On</p>
          <BaseTagInput name="labels" v-model="manageSettingValues" placeholder="Add new label..."></BaseTagInput>
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <div v-if="manageSettingId" class="flex-grow">
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

const emit = defineEmit(['save', 'remove', 'update:modelValue']);

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const store = useStore();

const modalTitle = computed(() => (manageSettingId.value ? 'Edit setting' : 'Add new setting'));

const isVisible = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
  },
});

const manageSettingId = computed(() => store.manageSettingId.value);

const manageSettingLabel = computed({
  get: () => store.manageSettingLabel.value,
  set: (value) => {
    store.setManageSettingLabel(value);
  },
});

const manageSettingKey = computed({
  get: () => store.manageSettingKey.value,
  set: (value) => {
    store.setManageSettingKey(value);
  },
});

const manageSettingValues = computed({
  get: () => store.manageSettingValues.value,
  set: (payload) => {
    store.setManageSettingValues(payload);
  },
});

const schema = markRaw(
  object({
    label: string().required(),
    key: string().required(),
    labels: array().min(2),
  })
);

const { handleSubmit } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit((values) => {
  emit('save');
});

const onRemove = () => {
  emit('remove', { selected: new Set().add({ id: manageSettingId.value }) });
};
</script>
