import { useState } from 'react';

export const useDealsSelection = () => {
  const [selectedDeals, setSelectedDeals] = useState([]);

  const toggleDealSelection = (dealId) => {
    setSelectedDeals(prev => 
      prev.includes(dealId) 
        ? prev.filter(id => id !== dealId) 
        : [...prev, dealId]
    );
  };

  const selectAllDeals = (deals) => {
    setSelectedDeals(
      selectedDeals.length === deals.length 
        ? [] 
        : deals.map(deal => deal.deal_id)
    );
  };

  const clearSelection = () => setSelectedDeals([]);

  return {
    selectedDeals,
    toggleDealSelection,
    selectAllDeals,
    clearSelection,
    setSelectedDeals
  };
};