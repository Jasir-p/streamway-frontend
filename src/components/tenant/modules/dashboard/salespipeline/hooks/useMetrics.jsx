export const useMetrics = () => {
  const calculateMetrics = (data, isDeals = false) => {
    const safeData = Array.isArray(data) ? data : [];  // ✅ Ensure it's an array

    const total = safeData.length;

    if (isDeals) {
      const totalValue = safeData.reduce((sum, item) => sum + (item.amount || 0), 0);
      const avgValue = total > 0 ? totalValue / total : 0;
      const wonDeals = safeData.filter(deal => deal.stage === 'closed_won').length;
      const winRate = total > 0 ? (wonDeals / total) * 100 : 0;
      return { total, totalValue, avgValue, winRate };
    }

    const convertedLeads = safeData.filter(lead => lead.status === 'converted').length;
    const conversionRate = total > 0 ? (convertedLeads / total) * 100 : 0;
    const contactedLeads = safeData.filter(lead => lead.status !== 'new').length;
    const contactRate = total > 0 ? (contactedLeads / total) * 100 : 0;

    return { total, conversionRate, contactRate, convertedLeads };
  };

  return { calculateMetrics };
};
