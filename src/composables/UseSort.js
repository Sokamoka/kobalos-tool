import { computed, reactive } from 'vue';
import { createMachine } from 'xstate';
import { sort, compose, toLower, propOr, descend, ascend } from 'ramda';

const SORT_STATE_ORIGINAL = 'original';
const SORT_STATE_DESCEND = 'descend';
const SORT_STATE_ASCEND = 'ascend';

const sortMachine = createMachine({
  id: 'sort',
  initial: SORT_STATE_ORIGINAL,
  states: {
    [SORT_STATE_ORIGINAL]: {
      on: {
        STATE: SORT_STATE_DESCEND,
      },
    },
    [SORT_STATE_DESCEND]: {
      on: {
        STATE: SORT_STATE_ASCEND,
      },
    },
    [SORT_STATE_ASCEND]: {
      on: {
        STATE: SORT_STATE_ORIGINAL,
      },
    },
  },
});

export const useSort = (initialData = []) => {
  const sortingData = reactive({ data: initialData });
  const sorting = reactive({
    sortTarget: '',
    sortState: SORT_STATE_ORIGINAL,
  });

  const setData = (newData) => {
    sortingData.data = newData;
  };

  const toggle = (target) => {
    sorting.sortTarget = target;
    sorting.sortState = sortMachine.transition(sorting.sortState, 'STATE').value;
  };

  const sortedData = computed(() =>
    sorting.sortState === SORT_STATE_ORIGINAL
      ? sortingData.data
      : makeSorter({ reverse: sorting.sortState === SORT_STATE_DESCEND, target: sorting.sortTarget })(sortingData.data)
  );

  const makeSorter = ({ reverse, target }) => sort((reverse ? descend : ascend)(compose(toLower, propOr('', target))));

  return {
    sortedData,
    sorting,
    setData,
    toggle,
  };
};

export default useSort;
