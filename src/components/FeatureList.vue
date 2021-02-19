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
          <IconSearch
            class="w-4 h-4 fill-current text-gray-400 pointer-events-none"
          ></IconSearch>
        </template>
        <template v-slot:after>
          <IconClear
            class="w-4 h-4 fill-current text-gray-400 hover:text-gray-600 cursor-pointer"
            @click="state.search = ''"
          ></IconClear>
        </template>
      </BaseInput>
    </div>
    <button
      class="button is-secondary is-xs sm:ml-3 mt-3 sm:mt-0"
      @click="$emit('add')"
    >
      <IconAddCircle class="w-4 h-4 fill-current mr-1"></IconAddCircle>
      New
    </button>
  </div>
  <div class="relative w-full overflow-auto">
    <table class="w-full">
      <thead>
        <tr>
          <th class="w-1/4">Title</th>
          <th class="w-auto">Variants</th>
          <th class="w-8 text-center">Edit</th>
          <th class="w-8 text-center">Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="feature in state.filteredFeatures"
          :key="feature.key"
          class="my-2"
        >
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
              <IconEdit class="w-6 h-6 fill-current"></IconEdit>
            </button>
          </td>
          <td class="text-gray-400">
            <button class="button is-icon is-flat" @click="onRemove(feature)">
              <IconDelete class="w-6 h-6 fill-current"></IconDelete>
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
import IconEdit from "../assets/svgs/create.svg?component";
import IconClear from "../assets/svgs/clear.svg?component";
import IconSearch from "../assets/svgs/search.svg?component";
import IconDelete from "../assets/svgs/delete.svg?component";
import IconAddCircle from "../assets/svgs/add-circle.svg?component";

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

const onEdit = (payload) => {
  emit("edit", payload);
};

const onRemove = (payload) => {
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
