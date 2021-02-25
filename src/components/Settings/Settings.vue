<template>
  <div class="container m-auto">
    <div class="bg-white rounded-lg shadow-lg">
      <SettingList :settings="state.settings" @add="onAdd" />
    </div>
  </div>
  <SettingsModal v-model="isModalVisible" @save="onSave"></SettingsModal>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { settingsRef } from '../../firebase';
import { useStore } from '../../store';
import SettingList from './SettingsList.vue';
import SettingsModal from './SettingsModal.vue';

const store = useStore();

const isModalVisible = ref(false);

const state = reactive({
  settings: store.settings,
});

onMounted(async () => {
  console.log('MOUNTED');
  settingsRef.on('value', (snapshot) => {
    const data = snapshot.val();
    store.setSettings(data);
  });
});

const onAdd = () => {
  store.resetManageSetting();
  isModalVisible.value = true;
};

const onSave = async () => {
  try {
    await store.saveSetting();
  } catch (error) {
    console.error(error.message);
  }
  isModalVisible.value = false;
}
</script>
