import { useMemo } from 'react';

export const usePipelineData = (leads, deals, dateFilter, isDateInRange, customDateRange) => {
  const filteredLeads = useMemo(() => {
    if (!leads || !Array.isArray(leads)) return [];
    
    return leads.filter(lead => {
      const dateMatch = dateFilter === 'all' || isDateInRange(lead?.created_at, dateFilter);
      return dateMatch;
    });
  }, [leads, dateFilter, customDateRange, isDateInRange]);

  const filteredDeals = useMemo(() => {
    if (!deals || !Array.isArray(deals)) return [];
    
    return deals.filter(deal => {
      const dateMatch = dateFilter === 'all' || isDateInRange(deal?.created_at, dateFilter);
      return dateMatch;
    });
  }, [deals, dateFilter, customDateRange, isDateInRange]);

  return { filteredLeads, filteredDeals };
};