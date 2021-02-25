<template>
  <div class="flex flex-col sm:flex-row p-7">
    <div class="mb-4 sm:mb-0 flex-grow">
      <h2 class="text-sm font-bold uppercase text-gray-900">
        Recent Settings List
      </h2>
      <p class="text-xs text-gray-400 font-medium">
        Showing <b>{{ filteredCount }}</b> of <b>{{ total }}</b> settings
      </p>
    </div>
    <div>
      <BaseInput name="filter" v-model="filter" @update:model-value="onInput" type="text" size="xs">
        <template v-slot:before>
          <Icon name="search" class="w-4 h-4 fill-current text-gray-400 pointer-events-none"></Icon>
        </template>
        <template v-slot:after>
          <Icon
            name="clear"
            class="w-4 h-4 fill-current text-gray-400 hover:text-gray-600 cursor-pointer"
            @click="onSearchClear"
          ></Icon>
        </template>
      </BaseInput>
    </div>
    <button class="button is-secondary is-xs sm:ml-3 mt-3 sm:mt-0" @click="onAdd">
      <Icon name="add-circle" class="w-4 h-4 fill-current mr-1"></Icon>
      New
    </button>
  </div>
  <div class="relative w-full overflow-auto">
    <table class="w-full">
      <thead>
        <tr>
          <th class="w-8">
            <BaseCheckbox
              :model-value="allItemSelected"
              :intermediate="someItemSelected"
              @update:model-value="bulkSelect"
            />
          </th>
          <template v-if="itemSelection.selected.size === 0">
            <th>Title</th>
            <th>Labels</th>
            <th class="text-center">Edit</th>
            <th class="text-center">Delete</th>
          </template>
          <template v-else>
            <th colspan="4" class="py-2">
              <button class="button is-xs is-primary" @click="onBulkRemove">
                <Icon name="delete" class="w-4 h-4 fill-current mr-2" />
                Delete {{ numberSelected }} items
              </button>
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="setting in filteredSettings" :key="setting.id" class="my-2">
          <td>
            <BaseCheckbox
              :model-value="itemSelection.selected.has(setting)"
              @update:model-value="itemSelection.toggle(setting)"
            />
          </td>
          <td>
            <h5 class="font-bold text-base">{{ setting.label }}</h5>
            <p class="text-gray-400">{{ setting.key }}</p>
          </td>
          <td>
            <ul class="flex py-2">
              <li v-for="value in setting.values" :key="value.value" class="tag is-primary is-xs is-fixed mr-2">
                {{ value.label }}
              </li>
            </ul>
          </td>
          <td class="text-gray-400">
            <button class="button is-icon is-flat" @click="onEdit(feature)">
              <Icon name="create" class="w-6 h-6 fill-current" />
            </button>
          </td>
          <td class="text-gray-400">
            <button class="button is-icon is-flat" @click="onRemove(feature)">
              <Icon name="delete" class="w-6 h-6 fill-current" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="filteredSettings.length === 0 && !isLoading"
      class="p-5 text-center text-sm text-gray-700 border-b border-gray-300"
    >
      No data to display...
    </div>
    <div v-if="isLoading" class="p-5 text-center text-sm text-gray-700 border-b border-gray-300">
      Loading...
    </div>
  </div>
  <div class="px-3 py-4">
    <a
      href="https://console.firebase.google.com/u/0/project/tyr-label-manager/database/tyr-label-manager/data"
      target="_blank"
      class="button is-flat is-secondary"
    >
      Open firebase database
    </a>
  </div>
</template>

<script setup>
import { defineProps, computed, defineEmit, inject, ref } from 'vue';
import BaseCheckbox from '../FormControls/BaseCheckbox.vue';
import useSelection from '../../composables/UseSelection.js';

const MATRICES_LIMIT = 3;

const confirm = inject('$confirm');

const props = defineProps({
  settings: {
    type: Array,
    required: true,
  },

  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmit(['add', 'edit', 'remove', 'bulk-remove']);

const filter = ref('');

const total = computed(() => props.settings.length);
const filteredCount = computed(() => filteredSettings.value.length);
const filteredSettings = computed(() =>
  props.settings.filter(
    (item) =>
      item.label.toLowerCase().includes(filter.value.toLowerCase()) || item.key.toLowerCase().includes(filter.value.toLowerCase())
  )
);

const itemSelection = useSelection();

let numberSelected = computed(() => itemSelection.selected.size);
let allItemSelected = computed(() => numberSelected.value === total && total > 0);
let someItemSelected = computed(() => {
  return numberSelected.value > 0 && numberSelected.value < total;
});
const bulkSelect = () => {
  if (allItemSelected.value) {
    itemSelection.clear();
  } else {
    itemSelection.addMultiple(filteredSettings);
  }
};

const onInput = (value) => {
  filter.value = value;
  if (numberSelected.value > 0) itemSelection.clear();
};

const onSearchClear = () => {
  filter.value = '';
  itemSelection.clear();
};

const onAdd = () => {
  itemSelection.clear();
  emit('add');
};

const onEdit = (payload) => {
  itemSelection.clear();
  emit('edit', payload);
};

const onRemove = async (payload) => {
  const result = await confirm({ title: 'Are you sure you want to delete?' });
  if (!result) return;
  itemSelection.clear();
  emit('remove', payload);
};

const onBulkRemove = async () => {
  const result = await confirm({ title: 'Are you sure you want to delete?' });
  if (!result) return;
  emit('bulk-remove', new Set(itemSelection.selected));
  itemSelection.clear();
};

const searchfFilter = (data, value) => {
  return data.filter(
    (item) =>
      item.label.toLowerCase().includes(value.toLowerCase()) || item.key.toLowerCase().includes(value.toLowerCase())
  );
};
</script>
