import { Routes, Route, Navigate, useLocation, matchPath } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchInVoiceStatus } from "./redux/slice/InvoiceSlice";
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
import LeadDetailPage from "./components/tenant/modules/dashboard/Leads/LeadOverview";
import EnquireyForm from "./components/tenant/modules/dashboard/Leads/EnqueryForm";
import AccountList from "./components/tenant/modules/customer/AccountsView";
import AccountDetail from "./components/tenant/modules/customer/AccountDetail";
import BillingDashboard from "./components/tenant/modules/Payment/Payment";
import PaymentForm from "./components/tenant/modules/Payment/Invoice";
import StripeProvider from "./components/tenant/modules/Payment/StripeProvider";
import PaymentPage from "./components/tenant/modules/Payment/PaymentPage";
// import ChatUI from "./components/tenant/modules/dashboard/chat/collabration";
import ChatUI from "./components/tenant/modules/dashboard/chat/MainChatUI";
import InvoiceModal from "./components/tenant/modules/Payment/BillModal";
import PendingRoute from "./components/tenant/routes/PendingRoute";
import EmailManagement from "./components/tenant/modules/dashboard/email/EmailManagment";
import MeetingApp from "./components/tenant/modules/dashboard/meetings/MeetingApp";
import NotificationsPage from "./components/tenant/modules/dashboard/notifications/Notifications";
import Billings from "./components/owner/tenants/Billings";
import TenantBillingInvoices from "./components/owner/tenants/billing/BillingInvoices";
import AdminLogin from "./components/owner/auth/AdminLogin";
import SalesPipelineDashboard from "./components/tenant/modules/dashboard/Leads/SalesPipline";
import DealsListPage from "./components/tenant/modules/dashboard/deals/DealsView";

function App() {
  const location = useLocation();
  const userId = useSelector((state)=>state.profile.id)
  const dispatch = useDispatch();
  

  const noSubdomainRoutes = [
    "/login",
    "/otp",
    "/",
    "/admin/dashboard",
    "/admin/tenants",
    "/admin/tenants/:tenant_id",
    "/admin/billings",           
    "/admin/billings/:billing_id", 
    "/admin/login"               
  ];

  const shouldUseSubdomainProvider = !noSubdomainRoutes.some(route => {
    if (!route.includes(":")) {
      return location.pathname === route;
    }
    return matchPath({ path: route }, location.pathname) !== null;
  });

  console.log('Current path:', location.pathname);
  console.log('Should use subdomain provider:', shouldUseSubdomainProvider);

  return (
    <ToastProvider>
      {shouldUseSubdomainProvider ? (
        <SubdomainProvider>
          <Routes>
            <Route path="/dashboard" element={<ProtectedRoute><PendingRoute><Dashboard/></PendingRoute></ProtectedRoute>} />
            <Route path="/setting" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>} />
            <Route path="/setting/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
            <Route path="/setting/security/role/:role_id/" element={<ProtectedRoute><RoleDetails /></ProtectedRoute>} />
            <Route path="/setting/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
            <Route path="/setting/genaral" element={<ProtectedRoute><Genaral /></ProtectedRoute>} />
            <Route path="/dashboard/team" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
            <Route path="/dashboard/team/teams/:team_id" element={<ProtectedRoute><TeamDetailView /></ProtectedRoute>} />
            <Route path="/setting/lead_form" element={<ProtectedRoute><FormBuilder /></ProtectedRoute>} />
            <Route path="/dashboard/sale/leads" element={<ProtectedRoute><MondayStyleLeadsTable /></ProtectedRoute>} />
            <Route path="/dashboard/sale/leads/:lead_id/" element={<ProtectedRoute><LeadDetailPage /></ProtectedRoute>} />
            <Route path="/dashboard/sale/enquiry" element={<ProtectedRoute><WebEnquirerComponent /></ProtectedRoute>} />
            <Route path="/dashboard/sale/deals" element={<ProtectedRoute><DealsListPage /></ProtectedRoute>} />
            <Route path="/dashboard/sale/salespipeline" element={<ProtectedRoute><SalesPipelineDashboard /></ProtectedRoute>} />
            
            <Route path="/dashboard/activity/task" element={<ProtectedRoute><TaskManagement /></ProtectedRoute>} />
            <Route path="/dashboard/profile/password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            <Route path="/dashboard/profile/personal" element={<ProtectedRoute><Personal /></ProtectedRoute>} />
            <Route path="/dashboard/customer/contacts" element={<ProtectedRoute><ContactView /></ProtectedRoute>} />
            <Route path="/Streamway/form/" element={<ProtectedRoute><EnquireyForm /></ProtectedRoute>} />
            <Route path="/dashboard/customer/accounts" element={<ProtectedRoute><AccountList /></ProtectedRoute>} />
            <Route path="/dashboard/customer/accounts/:account_id/" element={<ProtectedRoute><AccountDetail /></ProtectedRoute>} />
            
            <Route path="/setting/payment" element={<ProtectedRoute><StripeProvider><BillingDashboard/></StripeProvider></ProtectedRoute>}/>
            <Route path="/setting/payment/invoice/:invoiceId/pay" element={<ProtectedRoute><StripeProvider><PaymentPage/></StripeProvider></ProtectedRoute>}></Route>
            <Route path="/dashboard/collabration/chat" element={<ProtectedRoute><ChatUI/> </ProtectedRoute>} />
            <Route path="/payment/modal" element={<ProtectedRoute><InvoiceModal/></ProtectedRoute>}/>
            <Route path="/dashboard/activity/email" element={<ProtectedRoute><EmailManagement/> </ProtectedRoute>} />
            <Route path="/dashboard/activity/meetings" element={<ProtectedRoute><MeetingApp/></ProtectedRoute>} />
            <Route path="/dashboard/Notification" element={<ProtectedRoute><NotificationsPage/></ProtectedRoute>} />
            

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
          <Route path="/admin/billings" element={<Billings/>}/>
          <Route path="/admin/billings/:billing_id" element={<TenantBillingInvoices/>}/>
          <Route path="/admin/login" element={<AdminLogin/>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </ToastProvider>
  );
}

export default App;


