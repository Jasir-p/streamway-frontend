import { Routes, Route, Navigate, useLocation,matchPath } from "react-router-dom";
import { SubdomainProvider } from "./Subdomain";
import LandingPage from "./pages/tenant/LandingPage";
import LoginPage from "./pages/tenant/auth/LoginPage";
import OtpPage from "./pages/tenant/auth/OtpPage";
import Dashboard from "./components/tenant/dashboard/Dashbord";
import LoginEmoloye from "./pages/tenant/auth/LoginEmoloye";
import ProtectedRoute from "./components/tenant/routes/ProtectRoute";
import Security from "./components/tenant/settings/Security";
import SettingsLayout from "./components/tenant/settings/Settings";
import Users from "./components/tenant/modules/Users/Users";
import Genaral from "./components/tenant/settings/Genaral";
import TeamManagement from "./components/tenant/modules/Team/TeamView";
import TeamDetailView from "./components/tenant/modules/Team/TeamDetailView";
import FormBuilder from "./components/tenant/modules/LeadForm/LeadForm";
import MondayStyleLeadsTable from "./components/tenant/modules/dashboard/Leads/LeadsView";
import ChangePassword from "./components/tenant/dashboard/ChangePassword";
import Personal from "./components/tenant/dashboard/Personal";
import ToastProvider from "./components/common/ToastNotification";
import CRMAdminDashboard from "./components/owner/dashboard/DashBoardOwner";
import Tenants from "./components/owner/tenants/Tenants";
import TenantsDetail from "./components/owner/tenants/TenantsDetail";
import RoleDetails from "./components/tenant/modules/rbac/RoleDetails";
import TaskManagement from "./components/tenant/modules/dashboard/Task/TaskView";
import WebEnquirerComponent from "./components/tenant/modules/dashboard/Leads/WebEnquery";
import ContactView from "./components/tenant/modules/customer/contact";



function App() {
  const location = useLocation();

  // Define routes that do not require SubdomainProvider
  const noSubdomainRoutes = [
    "/login",
    
    "/otp",
    "/",
    "/admin/dashboard",
    "/admin/tenants",
    "/admin/tenants/:tenant_id"
  ];
  

  const shouldUseSubdomainProvider = !noSubdomainRoutes.some(route => {
    if (!route.includes(':')) {
      return location.pathname === route;
    }
    return matchPath({ path: route }, location.pathname) !== null; 
  });
  return (
    <ToastProvider>
      {shouldUseSubdomainProvider ? (
        <SubdomainProvider>
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/setting" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>} />
            <Route path="/setting/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
            <Route path ="/setting/security/role/:role_id/" element={<ProtectedRoute><RoleDetails/></ProtectedRoute>}/>
            <Route path="/setting/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/setting/genaral" element={<ProtectedRoute><Genaral /></ProtectedRoute>} />
            <Route path="/setting/team" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
            <Route path="/setting/team/teams/:team_id" element={<ProtectedRoute><TeamDetailView /></ProtectedRoute>} />
            <Route path="/setting/lead_form" element={<ProtectedRoute><FormBuilder /></ProtectedRoute>} />
            <Route path="/dashboard/sale/leads" element={<ProtectedRoute><MondayStyleLeadsTable /></ProtectedRoute>} />
            <Route path="/dashboard/sale/enquiry" element={<ProtectedRoute><WebEnquirerComponent /></ProtectedRoute>} />
            <Route path = "/dashboard/activity/task" element={<ProtectedRoute><TaskManagement/></ProtectedRoute>} />
            <Route path="/dashboard/profile/password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            <Route path="/dashboard/profile/personal" element={<ProtectedRoute><Personal /></ProtectedRoute>} />
            <Route path="/dashboard/customer/contacts" element={<ProtectedRoute><ContactView/></ProtectedRoute>} />
            <Route path="/signin" element={<LoginEmoloye />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SubdomainProvider>
      ) : (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/otp" element={<OtpPage />} />
           
            <Route path="/admin/dashboard" element={<CRMAdminDashboard />} />
            <Route path="/admin/tenants" element={<Tenants />} />
            <Route path="/admin/tenants/:tenant_id" element={<TenantsDetail />} />
            {/* Catchall route should be last */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      )}
    </ToastProvider>
  );
}

export default App;
