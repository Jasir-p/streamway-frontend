import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InvoiceModal from '../modules/Payment/BillModal';
import { fetchInVoiceStatus } from '../../../redux/slice/InvoiceSlice';
import EmployeeAccessModal from '../modules/Payment/AccessDeniedRoute';

const PendingRoute = ({ children }) => {
  const [isOwnerModalOpen, setOwnerModalOpen] = useState(false);
  const [isEmployeeModalOpen, setEmployeeModalOpen] = useState(false);
  const dispatch = useDispatch();

  const role = useSelector((state) => state.auth.role);
  const invoice = useSelector((state) => state.invoice.invoice);

  useEffect(() => {
    dispatch(fetchInVoiceStatus());
  }, [dispatch]);

  useEffect(() => {
    if (invoice?.status === 'pending') {
      const isExpired = invoice?.tenant_billing?.billing_expiry && 
                       new Date(invoice.tenant_billing.billing_expiry) < new Date();
      
      if (role === 'owner') {
        setOwnerModalOpen(true);
        setEmployeeModalOpen(false);
      } else if (role !== 'owner' && isExpired) {
        setEmployeeModalOpen(true);
        setOwnerModalOpen(false);
      } else {
        setOwnerModalOpen(false);
        setEmployeeModalOpen(false);
      }
    } else {
      setOwnerModalOpen(false);
      setEmployeeModalOpen(false);
    }
  }, [invoice, role]);

  const handleOwnerModalClose = () => setOwnerModalOpen(false);
  const handleEmployeeModalClose = () => setEmployeeModalOpen(false);

  return (
    <>
      {children}

      {isOwnerModalOpen && (
        <InvoiceModal onClose={handleOwnerModalClose} invoices={invoice} />
      )}
      
      {isEmployeeModalOpen && (
        <EmployeeAccessModal 
          onClose={handleEmployeeModalClose} 
          tenantBilling={invoice?.tenant_billing} 
        />
      )}
    </>
  );
};

export default PendingRoute;