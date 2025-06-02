import React from 'react'
import Layout from '../dashboard/Layout'
import TenantBillingTable from './billing/TenantBilling'
TenantBillingTable

const Billings = () => {
  return (
    <Layout>
        <TenantBillingTable/>
    </Layout>
  )
}

export default Billings
