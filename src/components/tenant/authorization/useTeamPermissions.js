// useTeamPermissions.js
import { useHasPermission } from "../../utils/PermissionCheck";
import { useSelector } from "react-redux";

export const useTeamPermissions = (selectedItems = []) => {
  const hasAdd = useHasPermission("add_team");
  const hasEdit = useHasPermission("edit_team");
  const hasDelete = useHasPermission("delete_team");
  const hasView = useHasPermission("view_team");

  const role = useSelector((state) => state.auth.role);
  const isOwner = role === "owner";

  return {
    canAdd: hasAdd || isOwner,
    canEdit: selectedItems.length > 0 && (hasEdit || isOwner),
    canDelete: hasDelete || isOwner,
    canView: hasView || isOwner,
  };
};
