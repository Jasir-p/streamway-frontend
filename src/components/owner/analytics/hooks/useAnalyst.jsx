import { useEffect, useState } from 'react';
import { getAnalyticsData} from '../api/AdminApi'; // adjust path

const useAnalytics = () => {
  const [tenantPayments, setTenantPayments] = useState([]);
  const [globalStats, setGlobalStats] = useState({
    total_paid: 0,
    this_month_paid: 0,
    last_month_paid: 0,
    due_amount:0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const data = await getAnalyticsData();
        
        
        const invoices = data?.invoices || [];

        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

        let global_total = 0;
        let this_month_total = 0;
        let last_month_total = 0;
        let due_amount = 0;

        const grouped = {};
        const monthlyMap = {};

        invoices.forEach((invoice) => {
          const tenant = invoice?.tenant_billing?.tenant;
          const billing = invoice?.tenant_billing;
          const tenantId = tenant?.id;

          if (!tenantId || !billing) return;

          const amount = parseFloat(invoice.amount || 0);
          const isPaid = invoice.status === 'paid';
          const paidAt = invoice.paid_at ? new Date(invoice.paid_at) : null;

          // Tenant-level aggregation
          if (!grouped[tenantId]) {
            grouped[tenantId] = {
              tenant_id: tenantId,
              tenant_name: tenant.name,
              industry: tenant.industry || "N/A",
              employees: billing.active_count_users - 1 || 0,
              monthly_payment: parseFloat(invoice.amount),
              total_paid: 0,
              last_paid_status: isPaid,
              last_paid_date: null,
              billing_due: !isPaid ? billing.billing_expiry : null,
            };
          }

          if (isPaid) {
            grouped[tenantId].total_paid += amount;
            global_total += amount;

            if (paidAt) {
              const paidMonth = paidAt.getMonth();
              const paidYear = paidAt.getFullYear();

              // For current and last month calculation
              if (paidMonth === thisMonth && paidYear === thisYear) {
                this_month_total += amount;
              } else if (paidMonth === lastMonth && paidYear === lastMonthYear) {
                last_month_total += amount;
              }

              // Monthly revenue grouping (not tenant-specific)
              const key = `${paidYear}-${paidMonth}`;
              if (!monthlyMap[key]) {
                monthlyMap[key] = {
                  month: paidAt.toLocaleString('default', { month: 'short' }),
                  year: paidYear,
                  revenue: 0,
                };
              }
              monthlyMap[key].revenue += amount;
            }
          }
          else{
            due_amount+=amount
          }
        });

        // Prepare formatted tenant table data
        const formatted = Object.values(grouped)
          .sort((a, b) => b.total_paid - a.total_paid)
          .map((item, index) => ({
            ...item,
            rank: index + 1,
            total_paid: item.total_paid.toFixed(2),
            monthly_payment: item.monthly_payment.toFixed(2),
          }));

        // Prepare monthly revenue chart data
        const sortedMonthlyData = Object.values(monthlyMap)
          .sort((a, b) =>
            new Date(`${a.month} 1, ${a.year}`) - new Date(`${b.month} 1, ${b.year}`)
          )
          .map((entry) => ({
            month: entry.month,
            revenue: Math.round(entry.revenue),
          }));

        // Set data in state
        setTenantPayments(formatted);
        setGlobalStats({
          total_paid: global_total.toFixed(2),
          this_month_paid: this_month_total.toFixed(2),
          last_month_paid: last_month_total.toFixed(2),
          due_amount:due_amount.toFixed(2)
        });
        setMonthlyData(sortedMonthlyData);
      } catch (error) {
        console.error("Error loading analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  return { tenantPayments, globalStats, monthlyData, loading };
};

export default useAnalytics;
