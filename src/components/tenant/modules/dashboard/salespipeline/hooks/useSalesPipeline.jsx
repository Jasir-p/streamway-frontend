import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { fetchSalesPipeline } from '../api/salesAPI';
import { buildFilterParams } from '../utils/buildFilterParams';

export const useSalesPipeline = (dateFilter, customDateRange) => {
  const role = useSelector((state) => state.auth.role);
  const userId = useSelector((state) => state.profile.id);

  const [pipelineData, setPipelineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPipeline = useCallback(async () => {
    setLoading(true);
    try {
      const filterParams = buildFilterParams(dateFilter, customDateRange, role, userId);
      const data = await fetchSalesPipeline(filterParams);
      console.log('Pipeline data with filters:', data);

      setPipelineData(data);
      setError(null);
    } catch (err) {
      console.error('Pipeline fetch failed:', err);
      setError(err.message || 'Failed to load pipeline data');
    } finally {
      setLoading(false);
    }
  }, [dateFilter, customDateRange, role, userId]);

  useEffect(() => {
    loadPipeline();
  }, [loadPipeline]);

  return {
    latest_leads: pipelineData?.latest_leads || [],
    latest_deals: pipelineData?.latest_deals || [],
    leads: pipelineData?.lead_status_summary || 0,
    deals: pipelineData?.deal_status_summary || 0,
    loading,
    error,
    retryFetch: loadPipeline,
  };
};
