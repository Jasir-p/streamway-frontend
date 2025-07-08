import { useState, useMemo } from 'react';

export const useDealsFilters = (deals,employees=[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({
    stage: '', 
    status: '', 
    priority: '', 
    source: '', 
    assignedTo: '', 
    dateRange: '', 
    amountRange: ''
  });

  const filteredDeals = useMemo(() => {
    if (!deals || deals.length === 0) return [];

    let filtered = deals.filter(deal => {
      
      
      // Search filter
      const matchesSearch = [
        deal.title || '', 
        deal.account_id?.name || '', 
        deal.owner?.name || ''
      ].some(field => 
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Other filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        
        if (key === 'amountRange') {
          const ranges = { 
            "< ₹50K": [0, 50000], 
            "₹50K - ₹1L": [50000, 100000], 
            "₹1L - ₹5L": [100000, 500000], 
            "> ₹5L": [500000, Infinity] 
          };
          const [min, max] = ranges[value] || [0, Infinity];
          const dealAmount = parseFloat(deal.amount);
          return dealAmount >= min && dealAmount < max;
        }
        
        if (key === 'assignedTo') {
          return String(deal.owner?.id) === value;
        }
        
        return deal[key] === value;
      });

      return matchesSearch && matchesFilters;
    });

    // Sorting
    filtered.sort((a, b) => {
      const getValue = (deal) => {
        switch (sortBy) {
          case 'title': return deal.title.toLowerCase();
          case 'amount': return parseFloat(deal.amount);
          case 'expected_close_date': return new Date(deal.expected_close_date);
          case 'created_at':
          default: return new Date(deal.created_at);
        }
      };
      
      const [aVal, bVal] = [getValue(a), getValue(b)];
      return sortOrder === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
    
    
    return filtered;

  }, [deals, searchTerm, filters, sortBy, sortOrder]);

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
    filteredDeals,
    activeFiltersCount,
    clearFilters
  };
};