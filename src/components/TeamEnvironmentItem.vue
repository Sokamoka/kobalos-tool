<template>
  <tr>
    <td>
      <button class="handle focus:outline-none" aria-label="drag">
        <Icon name="drag" class="w-6 h-6"></Icon>
      </button>
    </td>
    <td class="align-top">
      <BaseContenteditable
        name="label"
        v-model="fieldLabel"
        :contenteditable="state.isEditActive"
        class="p-2 font-semibold"
        :class="{ 'is-error': labelError }"
      />
      <p class="text-xs text-red-a400">{{ labelError }}</p>
    </td>
    <td class="align-top">
      <BaseContenteditable
        name="value"
        v-model="fieldValue"
        :contenteditable="state.isEditActive"
        class="p-2"
        :class="{ 'is-error': valueError }"
      />
      <p class="text-xs text-red-a400 leading-tight">{{ valueError }}</p>
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
import { defineProps, reactive, toRef, watch } from 'vue';
import { object, string } from 'yup';
import { useField, useForm } from 'vee-validate';
import BaseContenteditable from './FormControls/BaseContenteditable.vue';

const emit = defineEmit(['save', 'remove']);

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const item = toRef(props, 'item');

const state = reactive({
  isEditActive: item.value.isNew,
});

const schema = object({
  label: string().required(),
  value: string().required(),
});

const { setFieldValue, validate, values } = useForm({
  validationSchema: schema,
  initialValues: {
    label: item.value.label,
    value: item.value.value,
  },
});

const { value: fieldLabel, errorMessage: labelError } = useField('label');
const { value: fieldValue, errorMessage: valueError } = useField('value');

watch(item, (item) => {
  setFieldValue('label', item.label);
  setFieldValue('value', item.value);
});

const onEdit = () => {
  state.isEditActive = true;
};

const onSave = async () => {
  const { valid } = await validate();
  if (!valid) return;
  emit('save', { ...item.value, ...values, isNew: false });
  state.isEditActive = false;
};

const onRemove = () => {
  emit('remove', { ...item.value, ...values });
};
</script>
