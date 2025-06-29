// useContactPermissions.js
import { useHasPermission } from "../../utils/PermissionCheck";
import { useSelector } from "react-redux";

export const useContactPermissions = (selectedItems = []) => {
  const hasAdd = useHasPermission("add_contacts");
  const hasEdit = useHasPermission("edit_contacts");
  const hasDelete = useHasPermission("delete_contacts");
  const hasView = useHasPermission("view_contacts");

  const role = useSelector((state) => state.auth.role);
  const isOwner = role === "owner";

  return {
    canAdd: hasAdd || isOwner,
    canEdit: selectedItems.length > 0 && (hasEdit || isOwner),
    canDelete: hasDelete || isOwner,
    canView: hasView || isOwner,
  };
};
