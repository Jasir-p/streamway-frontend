import { useHasPermission } from "../../utils/PermissionCheck";
import { useSelector } from 'react-redux';

import React from 'react'

export const useLeadPermissions = (selectedLeads = []) => {
  const hasAddLead = useHasPermission("add_leads");
  const hasEditLead = useHasPermission("edit_leads");
  const hasDeleteLead = useHasPermission("delete_leads");
  const hasViewLead = useHasPermission("view_leads");

  const role = useSelector((state) => state.auth.role);

  const isOwner = role === "owner";

  return {
    canAddLead: hasAddLead || isOwner,
    canEditLead: selectedLeads.length > 0 && (hasEditLead || isOwner),
    canDeleteLead: hasDeleteLead || isOwner,
    canViewLead: hasViewLead || isOwner,
  };
};

