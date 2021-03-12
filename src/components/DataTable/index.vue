<template>
  <table>
    <thead>
      <tr>
        <th
          v-for="(column, prop) in columns"
          :key="prop"
          :class="[
            [column.class],
            {
              'is-active': prop === sort.sortTarget,
              'is-sortable cursor-pointer': column.sortable,
              'is-desc': prop === sort.sortTarget && sort.sortState === SORT_STATE_DESCEND,
              'is-asc': prop === sort.sortTarget && sort.sortState === SORT_STATE_ASCEND,
            },
          ]"
          @click="sortBy(column, prop)"
        >
          <slot :name="`header-${prop}`">
            <span>{{ column.label }}</span>
            <Icon
              v-if="column.sortable && prop !== sort.sortTarget"
              name="sort"
              class="state-sort"
              fill="currentColor"
            ></Icon>
            <Icon
              v-if="prop === sort.sortTarget && sort.sortState === SORT_STATE_ORIGINAL"
              name="sort"
              class="state-sort"
              fill="currentColor"
            ></Icon>
            <Icon
              v-if="prop === sort.sortTarget && sort.sortState === SORT_STATE_DESCEND"
              name="sort-down"
              class="mt-1 ml-1 w-4 h-4"
            ></Icon>
            <Icon
              v-if="prop === sort.sortTarget && sort.sortState === SORT_STATE_ASCEND"
              name="sort-up"
              class="mt-1 ml-1 w-4 h-4"
            ></Icon>
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td v-for="(_, prop) in columns" :key="prop" :class="[[_.class], { 'is-active': prop === sort.sortTarget }]">
          <slot :name="`cell-${prop}`" :row="row" :prop="prop">
            {{ row[prop] }}
          </slot>
        </td>
      </tr>
    </tbody>
    <tfoot>
      <tr v-if="rows.length === 0 && !isLoading">
        <td :colspan="columnCount" class="p-5 text-center">No data to display...</td>
      </tr>
      <tr v-if="isLoading">
        <td :colspan="columnCount" class="p-5 text-center">Loading...</td>
      </tr>
    </tfoot>
  </table>
</template>
<script>
import { toRefs } from '@vue/reactivity';
import { SORT_STATE_ASCEND, SORT_STATE_DESCEND, SORT_STATE_ORIGINAL } from './internal';

const DataTable = {
  name: 'DataTable',

  props: {
    columns: {
      type: Object,
      required: true,
    },

    rows: {
      type: Array,
      default: () => [],
    },

    sort: {
      type: Object,
      default: () => ({}),
    },

    isLoading: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const { columns, rows, sort } = toRefs(props);

    return {
      SORT_STATE_ASCEND,
      SORT_STATE_DESCEND,
      SORT_STATE_ORIGINAL,
      columns,
      sort,
      rows,
    };
  },

  computed: {
    columnCount() {
      return Object.keys(this.columns).length;
    },
  },

  methods: {
    sortBy(column, prop) {
      if (!column.sortable) return;
      this.$emit('sort', { target: prop, initialState: column.initSortState });
    },
  },
};
export default DataTable;
</script>
