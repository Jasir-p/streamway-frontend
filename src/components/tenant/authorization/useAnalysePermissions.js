// useAnalysePermissions.js
import { useHasPermission } from "../../utils/PermissionCheck";
import { useSelector } from "react-redux";

export const useAnalysePermissions = () => {
  const canViewTeam = useHasPermission("view_team_analyse");
  const canViewEmployees = useHasPermission("view_employee_analyse");
  const canViewAll = useHasPermission("view_all_analyse");

  const role = useSelector((state) => state.auth.role);
  const isOwner = role === "owner";

  return {
    canViewTeam: canViewTeam || isOwner,
    canViewEmployees: canViewEmployees || isOwner,
    canViewAll: canViewAll || isOwner,
  };
};
