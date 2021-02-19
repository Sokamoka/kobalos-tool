<template>
  <div class="container m-auto">
    <div class="flex flex-col sm:flex-row mb-5">
      <div class="flex-grow mb-5 sm:mb-0">
        <h1 class="text-3xl font-bold uppercase">
          Kobalos Tool
        </h1>
        <User />
      </div>
      <!-- <button
        class="button is-secondary flex items-center"
        @click="onClickAddNew"
      >
        <IconAddCircle class="w-5 h-5 fill-current mr-1"></IconAddCircle>
        Add new
      </button> -->
    </div>
    <div class="flex flex-col bg-white rounded-lg shadow-lg">
      <FeatureList
        :features="state.features"
        :is-loading="state.isLoading"
        @edit="onEdit"
        @remove="onRemove"
        @add="onClickAddNew"
      />
    </div>
  </div>
  <Modal
    v-model="state.isModalVisible"
    :title="modalTitle"
    size="sm"
    header
    footer
  >
    <template v-slot:content>
      <div class="mb-4">
        <label class="block mb-1">Title</label>
        <BaseInput v-model="state.feature.title" type="text" />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Name</label>
        <BaseInput v-model="state.feature.name" type="text" />
      </div>

      <div class="mb-4">
        <label class="block mb-1">Variants</label>
        <BaseTagInput
          :model-value="state.feature.variants"
          placeholder="Add new variant..."
          @add="onAddVariant"
          @remove="onRemoveVariant"
        ></BaseTagInput>
      </div>
    </template>
    <template v-slot:footer>
      <button class="button is-primary" @click="onSave">Save</button>
    </template>
  </Modal>
</template>

<script setup>
import { computed, onMounted, reactive } from "vue";
import { nanoid } from "nanoid";
import { db, featuresRef } from "../firebase";
import Modal from "./Modal.vue";
import User from "./User.vue";
import FeatureList from "./FeatureList.vue";
import BaseTagInput from "./BaseTagInput.vue";
import IconAddCircle from "../assets/svgs/add-circle.svg?component";
import IconRemoveCircle from "../assets/svgs/remove-circle.svg?component";

const state = reactive({
  isLoading: false,
  isModalVisible: false,
  feature: {
    id: null,
    title: "",
    name: "",
    variants: [],
  },
  validation: computed(() => ({
    title: state.feature.title.trim().length > 0,
    name: state.feature.name.trim().length > 0,
    variants: state.feature.variants.length > 0,
  })),
  features: {},
});

const modalTitle = computed(() =>
  state.feature.id ? "Edit feature" : "Add new feature"
);

const isValid = computed(() =>
  Object.keys(state.validation).every((key) => state.validation[key])
);

onMounted(async () => {
  state.isLoading = true;
  const snapshot = await featuresRef.once("value");
  state.isLoading = false;
  state.features = snapshot.val();

  featuresRef.on("value", (snapshot) => {
    const data = snapshot.val();
    state.features = data;
  });
});

function onClickAddNew() {
  state.feature = {
    id: null,
    title: "",
    name: "",
    variants: [],
  };
  state.isModalVisible = true;
}

function onRemoveVariant(value) {
  const index = state.feature.variants.indexOf(value);
  state.feature.variants.splice(index, 1);
}

function onAddVariant(value) {
  state.feature.variants.push(value);
}

function onEdit(payload) {
  state.feature = {
    id: payload.key,
    title: payload.title,
    name: payload.name,
    variants: Object.keys(payload.matrices).map(
      (key) => payload.matrices[key].name
    ),
  };
  state.isModalVisible = true;
}

const onRemove = async (payload) => {
  await db.ref(`kobalos/features/${payload.key}`).remove();
};

const onSave = async () => {
  if (!isValid.value) return;
  const matrices = state.feature.variants.map((item) => ({
    id: nanoid(6),
    name: item,
    checked: false,
  }));
  const newFeature = {
    title: state.feature.title,
    name: state.feature.name,
    matrices,
  };

  if (state.feature.id) {
    await db.ref(`kobalos/features/${state.feature.id}`).update(newFeature);
  } else {
    await featuresRef.push(newFeature);
  }
  state.isModalVisible = false;
};

const onDelete = () => {};
</script>
