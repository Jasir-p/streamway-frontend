import { useEffect, useState, useMemo } from "react";
import { Switch } from "@headlessui/react";
import { ChevronDown, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermission } from "../../../../redux/slice/PermissionSlice";
import axios from "axios";
import subdomainInterceptors from "../../../../Intreceptors/getSubdomainInterceptors";
subdomainInterceptors

const roleAccess = async (role, perm_id) => {
  const subdomain = localStorage.getItem("subdomain");
  const token = localStorage.getItem("access_token");

  const data = {
    role: role,
    Permission: perm_id,
  };

  try {
    const response = await subdomainInterceptors.post('/roleacess/',data);
    return response.data;
  } catch (error) {
    console.log("Error assigning permission", error.response?.data || error.message);
    throw error;
  }
};

const roleAccessDelete = async (role, perm_id) => {
  const subdomain = localStorage.getItem("subdomain");
  const token = localStorage.getItem("access_token");

  const data = {
    role: role,
    Permission: perm_id,
  };
    try {
      const response = await subdomainInterceptors.delete('/roleacess/', {
        data: data,
      });
      return response.data;
    } catch (error) {
      console.log("Error deleting permission", error.response?.data || error.message);
      throw error;
    }
  }

export default function PermissionsTable({ permission, role_id }) {
  const dispatch = useDispatch();
  const { permissions } = useSelector((state) => state.permission);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  console.log(permissions)
  // Fetch permissions on mount and when refreshTrigger changes
  useEffect(() => {
    dispatch(fetchPermission());
  }, [dispatch, refreshTrigger]);

  const rolebased = useMemo(() => {
    if (!permission) return {};
    return permission.reduce((acc, item) => {
      const moduleName = item.Permission.module;
      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }
      acc[moduleName].push({
        id: item.Permission.id,
        name: item.Permission.name,
        code_name: item.Permission.code_name,
      });
      return acc;
    }, {});
  }, [permission]);

  const groupedPermissions = useMemo(() => {
    return permissions.reduce((acc, item) => {
      const moduleName = item.module;
      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }
      acc[moduleName].push({
        id: item.id,
        name: item.name,
        code_name: item.code_name,
      });
      return acc;
    }, {});
  }, [permissions]);

  // Initialize with empty objects to avoid undefined errors
  const [enabledPermissions, setEnabledPermissions] = useState({});
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

// Modify this useEffect to handle cases where permission prop might be empty
useEffect(() => {
  if (permissions.length > 0) {
    const initialEnabled = {};
    const initialSelected = {};
    
    Object.keys(groupedPermissions).forEach((module) => {
      // Check if this module exists in the role permissions (if any are provided)
      const moduleExists = permission && permission.length > 0 && 
                          rolebased && rolebased[module] ? true : false;
      
      initialEnabled[module] = moduleExists;
      initialSelected[module] = {};
      
      groupedPermissions[module].forEach((perm) => {
        // Check if this specific permission exists for the role (if any are provided)
        const permissionExist = permission && permission.length > 0 &&
                               rolebased && rolebased[module] &&
                               rolebased[module].some((p) => p.id === perm.id || p.name === perm.name);
        
        initialSelected[module][perm.name] = !!permissionExist;
      });
    });
    
    setEnabledPermissions(initialEnabled);
    setSelectedPermissions(initialSelected);
    setIsInitialized(true);
  }
}, [permissions, permission, rolebased, groupedPermissions]);

  // Async function to handle permission toggle with proper loading and error states
  const togglePermission = async (module, permissionName, perm_id) => {
    setIsLoading(true);
    try {
      const newStatus = !selectedPermissions[module][permissionName];
      
      // First update local state optimistically
      setSelectedPermissions(prev => ({
        ...prev,
        [module]: {
          ...prev[module],
          [permissionName]: newStatus,
        },
      }));
      
      // Then make the API call
      if (newStatus) {
        await roleAccess(role_id, perm_id);
      } else {
        await roleAccessDelete(role_id, perm_id);
      }
      
      // Don't refresh permissions here - we'll handle updating UI state correctly
    } catch (error) {
      // Revert the optimistic update on error
      setSelectedPermissions(prev => ({
        ...prev,
        [module]: {
          ...prev[module],
          [permissionName]: !selectedPermissions[module][permissionName],
        },
      }));
      console.error("Failed to update permission:", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Toggle module-level permissions (this would need an API implementation)
  const toggleModulePermissions = (module, isEnabled) => {
    setEnabledPermissions(prev => ({
      ...prev,
      [module]: isEnabled
    }));
    
    // Here you'd need to add logic to toggle all permissions in the module
    // For now, we'll just update the UI
    const newModulePermissions = {};
    groupedPermissions[module].forEach(perm => {
      newModulePermissions[perm.name] = isEnabled;
    });
    
    setSelectedPermissions(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        ...newModulePermissions
      }
    }));
    
   
  };

  if (!isInitialized) {
    return <div className="p-4 bg-white rounded-lg shadow-lg max-w-full">Loading permissions...</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-full">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">
        Basic Permissions
      </h2>
      {isLoading && (
        <div className="text-blue-500 text-sm mb-2">Updating permissions...</div>
      )}
      <div className="space-y-1">
        {Object.keys(groupedPermissions).map((module) => (
          <div key={module} className="relative">
            <div className="flex items-center justify-between p-2 hover:bg-gray-100 transition rounded-md">
              <div className="flex items-center space-x-2">
                {enabledPermissions[module] ? (
                  <Check className="text-green-500" size={20} />
                ) : (
                  <X className="text-red-500" size={20} />
                )}
                <span className="text-sm font-bold text-gray-800">
                  {module}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                {rolebased[module] && (
                  <span className="text-gray-600 text-xs">
                    {rolebased[module].map((perm) => perm.name).join(", ")}
                  </span>
                )}
              
                <Switch
                  checked={!!enabledPermissions[module]}
                  onChange={() => toggleModulePermissions(module, !enabledPermissions[module])}
                  className={`${
                    enabledPermissions[module] ? "bg-green-500" : "bg-gray-300"
                  } relative inline-flex h-4 w-8 items-center rounded-full transition`}
                >
                  <span
                    className={`${
                      enabledPermissions[module]
                        ? "translate-x-4"
                        : "translate-x-1"
                    } inline-block h-3 w-3 transform rounded-full bg-white transition`}
                  />
                </Switch>
                <motion.div
                  className="cursor-pointer"
                  animate={{ rotate: openDropdown === module ? 180 : 0 }}
                  onClick={() =>
                    setOpenDropdown(openDropdown === module ? null : module)
                  }
                >
                  <ChevronDown size={18} className="text-gray-500" />
                </motion.div>
              </div>
            </div>

            <AnimatePresence>
              {openDropdown === module && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 mt-2 bg-white shadow-md border border-gray-200 rounded-md p-2 w-40 z-10"
                >
                  <div className="flex justify-end">
                    <X
                      className="text-gray-500 cursor-pointer"
                      size={18}
                      onClick={() => setOpenDropdown(null)}
                    />
                  </div>
                  <ul className="text-gray-700 text-xs space-y-1">
                    {groupedPermissions[module].map((perm) => (
                      <li key={perm.id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={!!selectedPermissions[module][perm.name]}
                          onChange={() => togglePermission(module, perm.name, perm.id)}
                          disabled={isLoading}
                          className="w-4 h-4 text-blue-500 border-gray-300 rounded"
                        />
                        <span>{perm.name}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}