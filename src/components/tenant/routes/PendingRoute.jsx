import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InvoiceModal from '../modules/Payment/BillModal';
import { fetchInVoiceStatus } from '../../../redux/slice/InvoiceSlice';

const PendingRoute = ({ children }) => {
  const [isOpen, setOpen] = useState(false);
  const dispatch = useDispatch();

  const role = useSelector((state) => state.auth.role);
  const invoice = useSelector((state) => state.invoice.invoice);

  useEffect(() => {
    dispatch(fetchInVoiceStatus());
  }, [dispatch]);

  useEffect(() => {
    if (invoice?.status === 'pending' && role === 'owner') {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [invoice, role]);

  const handleClose = () => setOpen(false);

  return (
    <>
      {children}
      {isOpen && (
        <InvoiceModal onClose={handleClose} invoices={invoice} />
      )}
    </>
  );
};

export default PendingRoute;
