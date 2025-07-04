// TenantRouter.jsx
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/tenant/routes/ProtectRoute";
import SettingsLayout from "../components/tenant/settings/Settings";
import Security from "../components/tenant/settings/Security";
import RoleDetails from "../components/tenant/modules/rbac/RoleDetails";
import Users from "../components/tenant/modules/Users/Users";
import Genaral from "../components/tenant/settings/Genaral";
import TeamManagement from "../components/tenant/modules/Team/TeamView";
import TeamDetailView from "../components/tenant/modules/Team/TeamDetailView";
import FormBuilder from "../components/tenant/modules/LeadForm/LeadForm";
import MondayStyleLeadsTable from "../components/tenant/modules/dashboard/Leads/LeadsView";
import LeadDetailPage from "../components/tenant/modules/dashboard/Leads/LeadOverview";
import WebEnquirerComponent from "../components/tenant/modules/dashboard/Leads/WebEnquery";
import DealsListPage from "../components/tenant/modules/dashboard/deals/DealsView";
import DealViewUI from "../components/tenant/modules/dashboard/deals/DealsOverView";
import SalesPipelineDashboard from "../components/tenant/modules/dashboard/salespipeline/SalesPipelineDashboard";
import TaskManagement from "../components/tenant/modules/dashboard/Task/TaskView";
import ChangePassword from "../components/tenant/dashboard/ChangePassword";
import Personal from "../components/tenant/dashboard/Personal";
import ContactView from "../components/tenant/modules/customer/contact";
import EnquireyForm from "../components/tenant/modules/dashboard/Leads/EnqueryForm";
import AccountList from "../components/tenant/modules/customer/AccountsView";
import AccountDetail from "../components/tenant/modules/customer/AccountDetail";
import StripeProvider from "../components/tenant/modules/Payment/StripeProvider";
import BillingDashboard from "../components/tenant/modules/Payment/Payment";
import PaymentPage from "../components/tenant/modules/Payment/PaymentPage";
import ChatUI from "../components/tenant/modules/dashboard/chat/MainChatUI";
import InvoiceModal from "../components/tenant/modules/Payment/BillModal";
import EmailManagement from "../components/tenant/modules/dashboard/email/EmailManagment";
import MeetingApp from "../components/tenant/modules/dashboard/meetings/MeetingApp";
import NotificationsPage from "../components/tenant/modules/dashboard/notifications/Notifications";
import CRMAnalytics from "../components/tenant/modules/dashboard/analytics/Analytics";
import Dashboard from "../components/tenant/dashboard/Dashbord";
import NotFoundPage from "../components/common/NotFoundPage";
import SubdomainCaptureRoute from "../components/tenant/routes/CheckRoute";
import LoginEmoloye from "../pages/tenant/auth/LoginEmoloye";
import PendingRoute from "../components/tenant/routes/PendingRoute";


const TenantRouter = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<ProtectedRoute><PendingRoute><Dashboard /></PendingRoute></ProtectedRoute>} />
      <Route path="setting" element={<ProtectedRoute><SettingsLayout /></ProtectedRoute>} />
      <Route path="setting/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
      <Route path="setting/security/role/:role_id/" element={<ProtectedRoute><RoleDetails /></ProtectedRoute>} />
      <Route path="setting/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
      <Route path="setting/genaral" element={<ProtectedRoute><Genaral /></ProtectedRoute>} />
      <Route path="dashboard/team" element={<ProtectedRoute><TeamManagement /></ProtectedRoute>} />
      <Route path="dashboard/team/teams/:team_id" element={<ProtectedRoute><TeamDetailView /></ProtectedRoute>} />
      <Route path="setting/lead_form" element={<ProtectedRoute><FormBuilder /></ProtectedRoute>} />
      <Route path="dashboard/sale/leads" element={<ProtectedRoute><MondayStyleLeadsTable /></ProtectedRoute>} />
      <Route path="dashboard/sale/leads/:lead_id/" element={<ProtectedRoute><LeadDetailPage /></ProtectedRoute>} />
      <Route path="dashboard/sale/enquiry" element={<ProtectedRoute><WebEnquirerComponent /></ProtectedRoute>} />
      <Route path="dashboard/sale/deals" element={<ProtectedRoute><DealsListPage /></ProtectedRoute>} />
      <Route path="dashboard/sale/deals/:deal_id/" element={<ProtectedRoute><DealViewUI /></ProtectedRoute>} />
      <Route path="dashboard/sale/salespipeline" element={<ProtectedRoute><SalesPipelineDashboard /></ProtectedRoute>} />
      <Route path="dashboard/activity/task" element={<ProtectedRoute><TaskManagement /></ProtectedRoute>} />
      <Route path="dashboard/profile/password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
      <Route path="dashboard/profile/personal" element={<ProtectedRoute><Personal /></ProtectedRoute>} />
      <Route path="dashboard/customer/contacts" element={<ProtectedRoute><ContactView /></ProtectedRoute>} />

      <Route path="dashboard/customer/accounts" element={<ProtectedRoute><AccountList /></ProtectedRoute>} />
      <Route path="dashboard/customer/accounts/:account_id/" element={<ProtectedRoute><AccountDetail /></ProtectedRoute>} />
      <Route path="setting/payment" element={<ProtectedRoute><StripeProvider><BillingDashboard /></StripeProvider></ProtectedRoute>} />
      <Route path="setting/payment/invoice/:invoiceId/pay" element={<ProtectedRoute><StripeProvider><PaymentPage /></StripeProvider></ProtectedRoute>} />
      <Route path="dashboard/collabration/chat" element={<ProtectedRoute><ChatUI /></ProtectedRoute>} />
      <Route path="payment/modal" element={<ProtectedRoute><InvoiceModal /></ProtectedRoute>} />
      <Route path="dashboard/activity/email" element={<ProtectedRoute><EmailManagement /></ProtectedRoute>} />
      <Route path="dashboard/activity/meetings" element={<ProtectedRoute><MeetingApp /></ProtectedRoute>} />
      <Route path="dashboard/Notification" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
      <Route path="dashboard/analytics" element={<ProtectedRoute><CRMAnalytics /></ProtectedRoute>} />
      <Route path="signin" element={<SubdomainCaptureRoute><LoginEmoloye /></SubdomainCaptureRoute>} />
        <Route path="Streamway/form" element={<SubdomainCaptureRoute><EnquireyForm /></SubdomainCaptureRoute>} />

 
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default TenantRouter;
