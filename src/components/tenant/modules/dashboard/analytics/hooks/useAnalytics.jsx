import React, { useState, useEffect } from 'react';
import { getEmployeeAnalyse, getTeamAnalyse,getTenantAnalyse } from '../api/AnalyticsApi';
import { useSelector } from 'react-redux';

export const useAnalytics = (filters, activeTab) => {
  const [data, setData] = useState({
    teamTaskData: [],
    taskStatusData: [],
    employeeData: [],
    radarData: [],
    tenantData:[],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const role = useSelector((state) =>state.auth.role)
  const userId = useSelector((state) =>state.profile.id)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {

        const params = {
          filter_type: filters.type || 'month', 
          ...(filters.type === 'custom' && filters.startDate && filters.endDate && {
            start_date: filters.startDate,
            end_date: filters.endDate,
          }),
        };


        

        let responseData;

        // Fixed: Match the activeTab values from the main component
        if (activeTab === 'employees') {  // Changed from 'employee' to 'employees'
          if (role !== 'owner') {
            responseData = await getEmployeeAnalyse(params, userId); // pass as separate arg
          } else {
            responseData = await getEmployeeAnalyse(params);
          }
          setData(prev => ({
            ...prev,
            employeeData: responseData || [],
            // You might want to set other employee-related data here
            radarData: responseData?.radarData || [],
          }));
        } else if (activeTab === 'teams') {  // Changed from 'team' to 'teams'
          responseData = await getTeamAnalyse(params);
          setData(prev => ({
            ...prev,
            teamTaskData: responseData || [],
            
          }));
        } else if (activeTab === 'admin') {
          // Add admin API call here when available
          responseData = await getTenantAnalyse(params);
          setData(prev => ({
            ...prev,
            tenantData:responseData||[],
          }));
        } else {
          // Fallback or initial state
          responseData = [];
        }

      } catch (err) {
        
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    // Only fetch data if we have a valid activeTab
    if (activeTab && (activeTab === 'teams' || activeTab === 'employees' || activeTab === 'admin')) {
      fetchData();
    }
  }, [filters, activeTab]);

  return { data, loading, error };
};