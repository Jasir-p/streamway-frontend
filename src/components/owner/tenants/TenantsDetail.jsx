import React from 'react'
import Layout from '../dashboard/Layout'
import { useParams } from 'react-router-dom';


const TenantsDetail = () => {
    const { tenant_id } = useParams();
  return (
    <div>
      <Layout>
      
  
  <h1>Tenant Details for ID: {tenant_id}</h1>;
      </Layout>
    </div>
  )
}

export default TenantsDetail
