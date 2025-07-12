import TenantRouter from "./route/TenantRoute";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastProvider } from "./components/common/ToastNotification";
import ProtectedRoute from "./components/tenant/routes/ProtectRoute";
import AdminRouteProtection from "./components/tenant/routes/GenarelRoute";

// All component imports
import LandingPage from "./pages/tenant/LandingPage";
import LoginPage from "./pages/tenant/auth/LoginPage";
import OtpPage from "./pages/tenant/auth/OtpPage";
import LoginEmoloye from "./pages/tenant/auth/LoginEmoloye";
import AdminLogin from "./components/owner/auth/AdminLogin";

// Admin
import CRMAdminDashboard from "./components/owner/dashboard/DashBoardOwner";
import Tenants from "./components/owner/tenants/Tenants";
import TenantsDetail from "./components/owner/tenants/TenantsDetail";
import Billings from "./components/owner/tenants/Billings";
import TenantBillingInvoices from "./components/owner/tenants/billing/BillingInvoices";
import TenantAnalytics from "./components/owner/analytics/AdminAnalytics";
import ActiveLogs from "./components/owner/activelogs/ActiveLogs";
import ForgotPassword from "./components/tenant/auth/ForgotPassword";



// Tenant Router


// Error page
import NotFoundPage from "./components/common/NotFoundPage";

function App() {
  return (
    <ToastProvider>
      <Routes>
        {/*  Public & Auth Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/forgotpasswrod" element={<ForgotPassword/>}/>
        

        {/*  Admin Routes */}
        <Route path="/admin/login" element={<AdminRouteProtection redirectIfAuthenticated={true}><AdminLogin /></AdminRouteProtection>} />
        <Route path="/admin/dashboard" element={<AdminRouteProtection><CRMAdminDashboard /></AdminRouteProtection>} />
        <Route path="/admin/tenants" element={<AdminRouteProtection><Tenants /></AdminRouteProtection>} />
        <Route path="/admin/tenants/:tenant_id" element={<AdminRouteProtection><TenantsDetail /></AdminRouteProtection>} />
        <Route path="/admin/billings" element={<AdminRouteProtection><Billings /></AdminRouteProtection>} />
        <Route path="/admin/billings/:billing_id" element={<AdminRouteProtection><TenantBillingInvoices /></AdminRouteProtection>} />
        <Route path="/admin/analytics" element={<AdminRouteProtection><TenantAnalytics /></AdminRouteProtection>} />
        <Route path="/admin/activelogs" element={<AdminRouteProtection><ActiveLogs /></AdminRouteProtection>} />
        <Route path="/admin/*" element={<NotFoundPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />

        

        {/*  Tenant Routes with prefix */}
        <Route path="/:prefix/*" element={<TenantRouter />} />

      
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
