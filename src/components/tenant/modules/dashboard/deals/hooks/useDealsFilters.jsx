import { useState, useMemo } from 'react';
import { useDebounce } from '../../../../../../hooks/useDebounce';

export const useDealsFilters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const debouncedSearchTerm = useDebounce(searchTerm, 100)
  const [filters, setFilters] = useState({
    stage: '', 
    status: '', 
    priority: '', 
    source: '', 
    assignedTo: '', 
    dateRange: '', 
    amountRange: ''
  });

  console.log(debouncedSearchTerm,filters);
  
  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchTerm ? 1 : 0);

  const clearFilters = () => {
    setFilters({ 
      stage: '', status: '', priority: '', source: '', 
      assignedTo: '', dateRange: '', amountRange: '' 
    });
    setSearchTerm('');
  };

  return {
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filters,
    setFilters,
    activeFiltersCount,
    clearFilters,
    debouncedSearchTerm,
  };
};