import { useState, useMemo } from 'react';

export const useDateFilter = () => {
  const [dateFilter, setDateFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const isDateInRange = (emailDate, filter) => {
    const today = new Date();
    const emailDateObj = new Date(emailDate);
    
    switch(filter) {
      case 'today':
        return emailDateObj.toDateString() === today.toDateString();
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        return emailDateObj >= weekAgo;
      case 'month':
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        return emailDateObj >= monthAgo;
      case 'last-month':
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        return emailDateObj >= lastMonthStart && emailDateObj <= lastMonthEnd;
      case 'custom':
        if (!customDateRange.startDate || !customDateRange.endDate) return true;
        const startDate = new Date(customDateRange.startDate);
        const endDate = new Date(customDateRange.endDate);
        return emailDateObj >= startDate && emailDateObj <= endDate;
      default:
        return true;
    }
  };

  return {
    dateFilter,
    setDateFilter,
    customDateRange,
    setCustomDateRange,
    isDateInRange
  };
}