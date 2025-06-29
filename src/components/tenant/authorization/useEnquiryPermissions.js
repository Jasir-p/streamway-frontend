// useEnquiryPermissions.js
import { useHasPermission } from "../../utils/PermissionCheck";
import { useSelector } from "react-redux";

export const useEnquiryPermissions = (selectedItems = []) => {
  const hasAdd = useHasPermission("add_enquiry");
  const hasEdit = useHasPermission("edit_enquiry");
  const hasDelete = useHasPermission("delete_enquiry");
  const hasView = useHasPermission("view_enquiry");

  const role = useSelector((state) => state.auth.role);
  const isOwner = role === "owner";

  return {
    canAdd: hasAdd || isOwner,
    canEdit: selectedItems.length > 0 && (hasEdit || isOwner),
    canDelete: hasDelete || isOwner,
    canView: hasView || isOwner,
  };
};
