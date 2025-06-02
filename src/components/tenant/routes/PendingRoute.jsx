import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import InvoiceModal from '../modules/Payment/BillModal'

const PendingRoute = ({ children }) => {
  const [isOpen, setOpen] = useState(false)
  const role = useSelector((state) =>state.auth.role)
  
 
  
  const { invoice } = useSelector((state) => state.invoice);


  
  useEffect(() => {
    if (invoice?.status==="pending") {
      setOpen(true)
    }
  }, [invoice])

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      {children}
      {(isOpen && role ==="owner") && <InvoiceModal onClose={handleClose} invoices={invoice} />}
    </>
  )
}

export default PendingRoute
