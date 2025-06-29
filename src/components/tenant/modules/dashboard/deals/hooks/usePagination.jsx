import { useState, useMemo } from 'react';

export const usePagination = (items, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

    return {
      totalPages,
      startIndex,
      paginatedItems,
      totalItems: items.length
    };
  }, [items, currentPage, itemsPerPage]);

  return {
    currentPage,
    setCurrentPage,
    ...paginationData
  };
};