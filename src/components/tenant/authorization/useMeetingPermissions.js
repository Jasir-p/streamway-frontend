import { useHasPermission } from "../../utils/PermissionCheck";
import { useSelector } from "react-redux";

export const useMeetingPermissions = (selectedItems = []) => {
  const hasAdd = useHasPermission("add_meeting");
  const hasEdit = useHasPermission("edit_meeting");
  const hasDelete = useHasPermission("delete_meeting");
  const hasView = useHasPermission("view_meeting");

  const role = useSelector((state) => state.auth.role);
  const isOwner = role === "owner";

  return {
    canAdd: hasAdd || isOwner,
    canEdit: selectedItems.length > 0 && (hasEdit || isOwner),
    canDelete: hasDelete || isOwner,
    canView: hasView || isOwner,
  };
};
