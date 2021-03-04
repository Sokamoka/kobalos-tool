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
              'is-sortable': column.sortable,
              'is-desc': prop === sort.sortTarget && sort.sortReverse,
              'is-asc': prop === sort.sortTarget && !sort.sortReverse
            }
          ]"
          @click="sortBy(column, prop)"
        >
          <slot :name="`header-${prop}`">
            <span>{{ column.label }}</span>
          </slot>
          <!-- <IconSort v-if="column.sortable && prop !== sort.sortTarget" class="icon-sort"></IconSort>
          <IconSortAsc v-if="prop === sort.sortTarget && sort.sortReverse" class="icon-sort"></IconSortAsc>
          <IconSortDesc v-if="prop === sort.sortTarget && !sort.sortReverse" class="icon-sort"></IconSortDesc> -->
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

export default {
  name: 'DataTable',

  props: {
    columns: {
      type: Object,
      required: true
    },

    rows: {
      type: Array,
      default: () => []
    },

    sort: {
      type: Object,
      default: () => ({})
    },

    isLoading: {
      type: Boolean,
      default: false
    }
  },

  setup(props) {
    const { columns, rows } = toRefs(props)

    return {
      columns,
      rows
    }
  },

  computed: {
    columnCount() {
      return Object.keys(this.columns).length;
    }
  },

  methods: {
    sortBy(column, prop) {
      if (!column.sortable) return;
      this.$emit('sort', prop);
    }
  }
};
</script>
