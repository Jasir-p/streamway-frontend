export const buildFilterParams = (dateFilter, customDateRange, role, userId) => {
  const filter = {
    filter_type: dateFilter,
  };

  if (dateFilter === 'custom' && customDateRange.startDate && customDateRange.endDate) {
    filter.start_date = customDateRange.startDate;
    filter.end_date = customDateRange.endDate;
  }

  const today = new Date();
  switch (dateFilter) {
    case 'today': {
      const todayStr = today.toISOString().split('T')[0];
      
      break;
    }
    case 'week': {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      break;
    }
    case 'month': {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      
      break;
    }
    case 'last-month': {
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
     
      break;
    }
    default:
      break; // 'all' or unknown → skip dates
  }

  return {
    userId: role === 'owner' ? null : userId,
    filter: JSON.stringify(filter),
  };
};
