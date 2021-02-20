<template>
  <div class="flex flex-col sm:flex-row p-7">
    <div class="mb-4 sm:mb-0 flex-grow">
      <h2 class="text-sm font-bold uppercase text-gray-500">
        Recent Features List
      </h2>
      <p class="text-xs text-gray-400 font-medium">
        Showing <b>{{ state.filteredCount }}</b> of
        <b>{{ state.total }}</b> features
      </p>
    </div>
    <div>
      <BaseInput v-model="state.search" type="text" class="is-xs">
        <template v-slot:before>
          <Icon
            name="search"
            class="w-4 h-4 fill-current text-gray-400 pointer-events-none"
          ></Icon>
        </template>
        <template v-slot:after>
          <Icon
            name="clear"
            class="w-4 h-4 fill-current text-gray-400 hover:text-gray-600 cursor-pointer"
            @click="state.search = ''"
          ></Icon>
        </template>
      </BaseInput>
    </div>
    <button
      class="button is-secondary is-xs sm:ml-3 mt-3 sm:mt-0"
      @click="onAdd"
    >
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
              :intermediate="someEmailsSelected"
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
              <button class="button is-xs is-primary">
                <Icon name="delete" class="w-4 h-4 fill-current mr-2" />
                Delete {{ numberSelected }} items
              </button>
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="feature in state.filteredFeatures"
          :key="feature.key"
          class="my-2"
        >
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
              <li
                v-for="matrice in feature.tags"
                :key="matrice.id"
                class="tag is-primary is-xs is-fixed mr-2"
              >
                {{ matrice.name }}
              </li>
              <li v-if="feature.add > 0" class="tag is-xs is-primary">
                + {{ feature.add }}
              </li>
            </ul>
          </td>
          <td class="text-gray-400">
            <button class="button is-icon is-flat" @click="onEdit(feature)">
              <Icon name="edit" class="w-6 h-6 fill-current" />
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
    <div
      v-if="isLoading"
      class="p-5 text-center text-sm text-gray-700 border-b border-gray-300"
    >
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
import { defineProps, computed, reactive, defineEmit } from "vue";
import BaseCheckbox from "./BaseCheckbox.vue";
import useSelection from "../composables/UseSelection.js";

const MATRICES_LIMIT = 3;

const props = defineProps({
  features: Object,
  isLoading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmit(["add", "edit", "remove"]);

const state = reactive({
  search: "",
  total: computed(() => Object.keys(props.features).length),
  filteredCount: computed(() => state.filteredFeatures.length),
  filteredFeatures: computed(() => searchfFilter(props.features, state.search)),
});

const itemSelection = useSelection();

let numberSelected = computed(() => itemSelection.selected.size)
let allItemSelected = computed(
  () => numberSelected.value === state.total && state.total > 0
);
let someEmailsSelected = computed(() => {
  return (
    numberSelected.value > 0 && numberSelected.value < state.total
  );
});
const bulkSelect = () => {
  if (allItemSelected.value) {
    itemSelection.clear();
  } else {
    itemSelection.addMultiple(state.filteredFeatures);
  }
};

const onAdd = () => {
  itemSelection.clear();
  emit("add");
};

const onEdit = (payload) => {
  itemSelection.clear();
  emit("edit", payload);
};

const onRemove = (payload) => {
  itemSelection.clear();
  emit("remove", payload);
};

const searchfFilter = (data, value) => {
  return Object.keys(data)
    .map((key) => ({
      key,
      ...data[key],
      tags: (data[key].matrices || []).slice(0, MATRICES_LIMIT),
      add: (data[key].matrices || []).length - MATRICES_LIMIT,
    }))
    .filter(
      (item) =>
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.name.toLowerCase().includes(value.toLowerCase())
    )
    .reverse();
};
</script>
