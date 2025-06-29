import { useHasPermission } from "../../utils/PermissionCheck";
import { useSelector } from 'react-redux';

import React from 'react'

export const useDealPermissions = (selectedLeads = []) => {
  const hasAddLead = useHasPermission("add_deals");
  const hasEditLead = useHasPermission("edit_deals");
  const hasDeleteLead = useHasPermission("delete_deals");
  const hasViewLead = useHasPermission("view_deals");

  const role = useSelector((state) => state.auth.role);

  const isOwner = role === "owner";

  return {
    canAddLead: hasAddLead || isOwner,
    canEditLead: selectedLeads.length > 0 && (hasEditLead || isOwner),
    canDeleteLead: hasDeleteLead || isOwner,
    canViewLead: hasViewLead || isOwner,
  };
};
