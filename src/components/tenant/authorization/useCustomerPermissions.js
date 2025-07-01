// useCustomerPermissions.js
import { useHasPermission } from "../../utils/PermissionCheck";
import { useSelector } from "react-redux";

export const useCustomerPermissions = (selectedItems = []) => {
  const hasAdd = useHasPermission("add_customer");
  const hasEdit = useHasPermission("edit_customer");
  const hasDelete = useHasPermission("delete_customer");
  const hasView = useHasPermission("view_customer");

  const role = useSelector((state) => state.auth.role);
  const isOwner = role === "owner";

  return {
    canAdd: hasAdd || isOwner,
    canEdit:  (hasEdit || isOwner),
    canDelete: hasDelete || isOwner,
    canView: hasView || isOwner,
  };
};
