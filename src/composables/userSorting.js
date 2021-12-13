import { computed, ref } from "vue";
export default function (items = [], by = "defaultSortAverage", order = "asc") {
  const sortBy = ref(by);

  const sortedItems = computed(() => {
    items.value.sort((a, b) => {
      const multiplier = order === "asc" ? 1 : -1;
      if (a[sortBy.value] == b[sortBy.value]) {
        return 0;
      } else if (a[sortBy.value] > b[sortBy.value]) {
        return 1 * multiplier;
      } else if (a[sortBy.value] < b[sortBy.value]) {
        return -1 * multiplier;
      }
    });
    return items.value;
  });

  return {
    sortedItems,
    sortBy,
  };
}
