import { computed, reactive } from 'vue';
import { sort, compose, toLower, prop, descend, ascend } from 'ramda';

export const useSort = (data) => {
  const sorting = reactive({
    data: data || [],
    target: 'title',
    reverse: null,
  });

  const setData = (data) => {
    sorting.data = data;
  };

  const toggle = () => {
    sorting.reverse = !sorting.reverse;
  };

  const sortedData = computed(() => makeSorter({ reverse: sorting.reverse, target: sorting.target })(sorting.data));

  const makeSorter = ({ reverse, target }) => sort((reverse ? descend : ascend)(compose(toLower, prop(target))));

  return {
    sortedData,
    sorting,
    setData,
    toggle,
  };
};

export default useSort;
