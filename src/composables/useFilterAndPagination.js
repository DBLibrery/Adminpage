// src/composables/useFilterAndPagination.js
import { ref, computed, watch } from 'vue';

export function useFilterAndPagination(items, searchKeys) {
  const searchTerm = ref('');
  const debouncedSearchTerm = ref('');
  let debounceTimeout = null;

  watch(searchTerm, (newTerm) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      debouncedSearchTerm.value = newTerm;
    }, 300);
  });

  const itemsPerPage = ref(5);
  const currentPage = ref(1);

  const filteredItems = computed(() => {
    if (!debouncedSearchTerm.value) {
      return items.value;
    }

    const lowerCaseSearchTerm = debouncedSearchTerm.value.toLowerCase();

    return items.value.filter(item => {
      return searchKeys.some(key => {
        const value = item[key];
        if (value === null || value === undefined) {
          return false;
        }
        return String(value).toLowerCase().includes(lowerCaseSearchTerm);
      });
    });
  });

  const displayedItems = computed(() => {
    return filteredItems.value.slice(0, currentPage.value * itemsPerPage.value);
  });

  const hasMore = computed(() => {
    return displayedItems.value.length < filteredItems.value.length;
  });

  const loadMore = () => {
    currentPage.value++;
  };

  return {
    searchTerm,
    debouncedSearchTerm,
    filteredItems,
    displayedItems,
    hasMore,
    loadMore,
    currentPage,
  };
}