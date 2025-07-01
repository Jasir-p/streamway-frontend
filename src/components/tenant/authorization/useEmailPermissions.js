// useEmailPermissions.js
import { useHasPermission } from "../../utils/PermissionCheck";
import { useSelector } from "react-redux";

export const useEmailPermissions = (selectedItems = []) => {
  const hasAdd = useHasPermission("add_emails");
  const hasEdit = useHasPermission("edit_emails");
  const hasDelete = useHasPermission("delete_emails");
  const hasView = useHasPermission("view_emails");

  const role = useSelector((state) => state.auth.role);
  const isOwner = role === "owner";

  return {
    canAdd: hasAdd || isOwner,
    canEdit:  (hasEdit || isOwner),
    canDelete: hasDelete || isOwner,
    canView: hasView || isOwner,
  };
};
