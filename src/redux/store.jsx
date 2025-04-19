import { configureStore } from "@reduxjs/toolkit";
import roleReducer from "./slice/roleSlice";
import permissionReducer from "./slice/PermissionSlice";
import tenantEmailReducer from "./slice/TenantEmailSlice";
import userListReducer from "./slice/UsersSlice";
import EmployeeReducer from "./slice/EmployeeSlice";
import authrizReducer from "./slice/authrizeSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import  teamsSliceReducer from "./slice/TeamSlice";
import fieldSliceReducer from "./slice/LeadFormSlice";
import ProfileReducer from "./slice/ProfileSlice";
import companyDetailsSliceReducer from "./slice/CompanyDetails";
import tenantSliceReducer from "./slice/projectadmin/CompanySlice.jsx";
import leadsSliceReducer from "./slice/leadsSlice";
import enquirySliceReducer from "./slice/EnquirySlice";
import contactSliceReducer from "./slice/contactSlice";
import accountsReducer from "./slice/AccountsSlice";


const persistConfigAuth = {
  key: "auth",
  storage,
};

const persistConfigEmployee = {
  key: "employee",
  storage,
};

const persistConfigTenantEmail = {
  key: "tenantEmail",
  storage,
};
const persistConfigProfile = {
  key: "profile",
  storage,
  };



const persistedAuth = persistReducer(persistConfigAuth, authrizReducer);
const persistedEmployee = persistReducer(persistConfigEmployee, EmployeeReducer);
const persistedTenantEmail = persistReducer(persistConfigTenantEmail, tenantEmailReducer);
const persistedProfile = persistReducer(persistConfigProfile, ProfileReducer);


const store = configureStore({
  reducer: {
    roles: roleReducer,
    permission: permissionReducer,
    tenantEmail: persistedTenantEmail,
    users: userListReducer,
    employesubdomain: persistedEmployee,
    auth: persistedAuth,
    teams: teamsSliceReducer,
    fields:fieldSliceReducer,
    profile:persistedProfile,
    companyDetails:companyDetailsSliceReducer,
    tenants:tenantSliceReducer,
    leads:leadsSliceReducer,
    enquiry:enquirySliceReducer,
    contacts:contactSliceReducer,
    accounts:accountsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});


export const persistor = persistStore(store);
export default store;
