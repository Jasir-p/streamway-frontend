import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchDeals,updateDealsBulk } from '../../../../../../redux/slice/DealSlice';
import { getUser } from '../../../../../../Intreceptors/LeadsApi';

export const useDealsData = () => {
  const [change, setChange] = useState(false);
  const dispatch = useDispatch();
  
  const { deals, loading, error,next,previous } = useSelector((state) => state.deals);
  const role = useSelector((state) => state.auth.role);
  const userId = useSelector((state) => state.profile.id);
    const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const data = await getUser(role==='owner'?role:userId);
      if (data) {
        setEmployees(data);
      }
    };

    fetchEmployees();
  }, []);
  useEffect(() => {
    dispatch(fetchDeals({role, userId:userId}));
  }, [dispatch, change, role, userId]);

  const refreshDeals = () => {
    setChange(!change);
  };
  
const onNext = () => {
  dispatch(fetchDeals({ role, userId: userId, url: next }));
};

const onPrevious = () => {
  dispatch(fetchDeals({ role, userId: userId, url: previous }));
};

  const handleBulkUpdate = async (dealIds, updates) => {
    try {
      await dispatch(updateDealsBulk({ dealIds, updates }));
      dispatch(fetchDeals(role, userId));
      return { success: true };
    } catch (error) {
      
      return { success: false, error: error.message };
    }
  };

  return {
    deals,
    loading,
    error,
    role,
    userId,
    next,
    previous,
    employees,
    onNext,
    onPrevious,
    refreshDeals,
    handleBulkUpdate
  };
};
