import { reactive } from 'vue';

export const useSelection = () => {
  const selected = reactive(new Set());
  const toggle = (item) => {
    if (selected.has(item)) {
      selected.delete(item);
    } else {
      selected.add(item);
    }
  };

  const clear = () => {
    selected.clear();
  };

  const addMultiple = (newItems) => {
    newItems.forEach((item) => {
      selected.add(item);
    });
  };

  return {
    selected,
    toggle,
    clear,
    addMultiple,
  };
};

export default useSelection;
