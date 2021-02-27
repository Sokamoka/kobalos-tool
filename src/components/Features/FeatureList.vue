<template>
  <div class="flex flex-col sm:flex-row p-7">
    <div class="mb-4 sm:mb-0 flex-grow">
      <h2 class="text-sm font-bold uppercase text-gray-900">
        Recent Features List
      </h2>
      <p class="text-xs text-gray-400 font-medium">
        Showing <b>{{ state.filteredCount }}</b> of <b>{{ state.total }}</b> features
      </p>
    </div>
    <div>
      <BaseInput name="filter" v-model="search" @update:model-value="onInput" type="text" size="xs">
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
              :intermediate="someItemsSelected"
              @update:model-value="bulkSelect"
            />
          </th>
          <template v-if="itemSelection.selected.size === 0">
            <th>Title</th>
            <th>Variants</th>
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
        <tr v-for="feature in state.filteredFeatures" :key="feature.key" class="my-2">
          <td>
            <BaseCheckbox
              :model-value="itemSelection.selected.has(feature)"
              @update:model-value="itemSelection.toggle(feature)"
            />
          </td>
          <td>
            <h5 class="font-bold text-base">{{ feature.title }}</h5>
            <p class="text-gray-400">{{ feature.name }}</p>
          </td>
          <td>
            <ul class="flex py-2">
              <li v-for="matrice in feature.tags" :key="matrice" class="tag is-primary is-xs is-fixed mr-2">
                {{ matrice }}
              </li>
              <li v-if="feature.tagsOverLimit > 0" class="tag is-xs is-primary">+ {{ feature.tagsOverLimit }}</li>
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
      v-if="state.filteredFeatures.length === 0 && !isLoading"
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
import { defineProps, computed, reactive, defineEmit, inject, ref } from 'vue';
import BaseCheckbox from '../FormControls/BaseCheckbox.vue';
import useSelection from '../../composables/UseSelection.js';

const notify = inject('notify');

const props = defineProps({
  features: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmit(['add', 'edit', 'remove', 'bulk-remove']);

const search = ref('');
const state = reactive({
  total: computed(() => Object.keys(props.features).length),
  filteredCount: computed(() => state.filteredFeatures.length),
  filteredFeatures: computed(() => searchfFilter(props.features, search.value)),
});

const itemSelection = useSelection();

let numberSelected = computed(() => itemSelection.selected.size);
let allItemSelected = computed(() => numberSelected.value === state.total && state.total > 0);
let someItemsSelected = computed(() => {
  return numberSelected.value > 0 && numberSelected.value < state.total;
});
const bulkSelect = () => {
  if (allItemSelected.value) {
    itemSelection.clear();
  } else {
    itemSelection.addMultiple(state.filteredFeatures);
  }
};

const onInput = (value) => {
  search.value = value;
  if (numberSelected.value > 0) itemSelection.clear();
};

const onSearchClear = () => {
  search.value = '';
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
  const result = await notify({ type: 'confirm', title: 'Are you sure you want to delete?' });
  if (!result) return;
  itemSelection.clear();
  emit('remove', payload.id);
};

const onBulkRemove = async () => {
  const result = await notify({ type: 'confirm', title: 'Are you sure you want to delete?' });
  if (!result) return;
  emit('bulk-remove', new Set(itemSelection.selected));
  itemSelection.clear();
};

const searchfFilter = (data, value) =>
  data.filter(
    (item) =>
      item.title.toLowerCase().includes(value.toLowerCase()) || item.name.toLowerCase().includes(value.toLowerCase())
  );
</script>
