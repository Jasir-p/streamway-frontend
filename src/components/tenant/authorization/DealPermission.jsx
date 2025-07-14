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
    canAddDeal: hasAddLead || isOwner,
    canEditDeal:  (hasEditLead || isOwner),
    canDeleteDeal: hasDeleteLead || isOwner,
    canViewDeal: hasViewLead || isOwner,
  };
};
