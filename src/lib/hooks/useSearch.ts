import { useState, useEffect, useMemo, useCallback } from "react";

export type SearchConfig<T> = {
  searchableFields: (keyof T)[];
  customFilter?: (item: T, searchTerm: string) => boolean;
};

export function useSearch<T extends Record<string, any>>(
  items: T[],
  config: SearchConfig<T>
) {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const defaultFilter = useCallback(
    (item: T, term: string) => {
      if (!term.trim()) return true;

      const normalizedTerm = term.toLowerCase().trim();

      return config.searchableFields.some((field) => {
        const value = item[field];
        if (value == null) return false;

        return String(value).toLowerCase().includes(normalizedTerm);
      });
    },
    [config.searchableFields]
  );

  const filteredItems = useMemo(() => {
    const filterFn = config.customFilter || defaultFilter;

    if (!debouncedSearchTerm.trim()) {
      return items;
    }

    return items.filter((item) => filterFn(item, debouncedSearchTerm));
  }, [items, debouncedSearchTerm, defaultFilter, config.customFilter]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
    handleSearchChange,
  };
}
