import { createMachine } from 'xstate';
import { computed, reactive } from 'vue';
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
        DIRECTION1: SORT_STATE_DESCEND,
        DIRECTION2: SORT_STATE_ASCEND,
      },
    },
    [SORT_STATE_DESCEND]: {
      on: {
        DIRECTION1: SORT_STATE_ASCEND,
        DIRECTION2: SORT_STATE_ORIGINAL,
      },
    },
    [SORT_STATE_ASCEND]: {
      on: {
        DIRECTION1: SORT_STATE_ORIGINAL,
        DIRECTION2: SORT_STATE_DESCEND,
      },
    },
  },
});

export const useSort = (initialData = [], initialSort = {}) => {
  const sortingData = reactive({ data: initialData });
  const sorting = reactive({
    sortTarget: initialSort.sortTarget || '',
    sortState: initialSort.sortState || SORT_STATE_ORIGINAL,
  });

  const setData = (newData) => {
    sortingData.data = newData;
  };

  const toggle = ({ target, initialState }) => {
    const currentTarget = sorting.sortTarget;
    sorting.sortTarget = target;
    if (currentTarget !== target && initialState) {
      sorting.sortState = initialState;
      return;
    }
    const direction = initialState === SORT_STATE_ASCEND ? 'DIRECTION2' : 'DIRECTION1';
    sorting.sortState = sortMachine.transition(sorting.sortState, direction).value;
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
