// useTaskPermissions.js
import { useHasPermission } from "../../utils/PermissionCheck";
import { useSelector } from "react-redux";

export const useTaskPermissions = (selectedItems = []) => {
  const hasAdd = useHasPermission("add_task");
  const hasEdit = useHasPermission("edit_task");
  const hasDelete = useHasPermission("delete_task");
  const hasView = useHasPermission("view_task");

  const role = useSelector((state) => state.auth.role);
  const isOwner = role === "owner";

  return {
    canAdd: hasAdd || isOwner,
    canEdit:  (hasEdit || isOwner),
    canDelete: hasDelete || isOwner,
    canView: hasView || isOwner,
  };
};
