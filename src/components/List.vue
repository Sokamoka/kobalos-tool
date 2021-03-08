<template>
  <div class="flex flex-col sm:flex-row p-7">
    <slot name="title" :state="state" />
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
    <button class="button is-secondary is-xs sm:ml-3 mt-3 sm:mt-0" aria-label="New" @click="onAdd">
      <Icon name="add-circle" class="w-4 h-4 fill-current mr-1"></Icon>
      New
    </button>
  </div>
  <div class="relative w-full overflow-auto">
    <DataTable :columns="state.columns" :rows="sortedData" :sort="sorting" @sort="onSort">
      <template v-slot:header-index>
        <BaseCheckbox
          :model-value="allItemSelected"
          :intermediate="someItemsSelected"
          @update:model-value="bulkSelect"
        />
      </template>

      <template v-if="itemSelection.selected.size > 0" v-slot:header-title>
        <button class="button is-xs is-primary" aria-label="Delete items" @click.stop="onBulkRemove">
          <Icon name="delete" class="w-4 h-4 fill-current mr-2" />
          Delete {{ numberSelected }} items
        </button>
      </template>

      <template v-slot:cell-index="{ row }">
        <BaseCheckbox :model-value="itemSelection.selected.has(row)" @update:model-value="itemSelection.toggle(row)" />
      </template>

      <template v-slot:cell-title="{ row }">
        <slot name="cell-title" :row="row" />
      </template>

      <template v-slot:cell-values="{ row }">
        <ul class="flex py-2">
          <li v-for="tag in row.tags" :key="tag" class="tag is-primary is-xs is-fixed mr-2">
            {{ tag }}
          </li>
          <li v-if="row.tagsOverLimit > 0" class="tag is-xs is-primary">+ {{ row.tagsOverLimit }}</li>
        </ul>
      </template>

      <template v-slot:cell-edit="{ row }">
        <button class="button is-icon is-flat" aria-label="Edit" @click="onEdit(row)">
          <Icon name="create" class="w-6 h-6 fill-current" />
        </button>
      </template>

      <template v-slot:cell-delete="{ row }">
        <button class="button is-icon is-flat" aria-label="Delete" @click="onRemove(row)">
          <Icon name="delete" class="w-6 h-6 fill-current" />
        </button>
      </template>
    </DataTable>
  </div>
  <div class="px-3 py-4">
    <a
      href="https://console.firebase.google.com/u/0/project/tyr-label-manager/database/tyr-label-manager/data"
      target="_blank"
      rel="noreferrer"
      class="button is-flat is-secondary"
    >
      Open firebase database
    </a>
  </div>
</template>

<script setup>
import { defineProps, computed, reactive, defineEmit, ref, watch } from 'vue';
import DataTable from './DataTable.vue';
import BaseCheckbox from './FormControls/BaseCheckbox.vue';
import useSelection from '../composables/UseSelection.js';
import useSort from '../composables/UseSort.js';

const props = defineProps({
  columns: {
    type: Object,
    required: true,
  },

  data: {
    type: Array,
    required: true,
  },

  isLoading: {
    type: Boolean,
    default: false,
  },

  searchFilter: {
    type: Function,
    required: true,
  },
});

const emit = defineEmit(['add', 'edit', 'remove']);

const search = ref('');
const state = reactive({
  total: computed(() => Object.keys(props.data).length),
  filteredCount: computed(() => state.filteredData.length),
  filteredData: computed(() => props.searchFilter(props.data, search.value)),
  columns: props.columns,
});

const { sortedData, sorting, setData, toggle } = useSort(state.filteredData);

watch(state, (value) => {
  setData(value.filteredData);
});

const itemSelection = useSelection();

const numberSelected = computed(() => itemSelection.selected.size);
const allItemSelected = computed(() => numberSelected.value === state.total && state.total > 0);
const someItemsSelected = computed(() => {
  return numberSelected.value > 0 && numberSelected.value < state.total;
});
const bulkSelect = () => {
  if (allItemSelected.value) {
    itemSelection.clear();
  } else {
    itemSelection.addMultiple(state.filteredData);
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

const onRemove = (payload) => {
  itemSelection.clear();
  emit('remove', { selected: new Set().add({ id: payload.id }) });
};

const onBulkRemove = () => {
  emit('remove', itemSelection);
};

const onSort = (payload) => {
  toggle(payload);
};
</script>
