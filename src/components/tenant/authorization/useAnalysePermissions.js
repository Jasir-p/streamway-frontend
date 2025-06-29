// useAnalysePermissions.js
import { useHasPermission } from "../../utils/PermissionCheck";
import { useSelector } from "react-redux";

export const useAnalysePermissions = () => {
  const canViewTeam = useHasPermission("analyse_team");
  const canViewEmployees = useHasPermission("analyse_employess");
  const canViewAll = useHasPermission("analyse_all");

  const role = useSelector((state) => state.auth.role);
  const isOwner = role === "owner";

  return {
    canViewTeam: canViewTeam || isOwner,
    canViewEmployees: canViewEmployees || isOwner,
    canViewAll: canViewAll || isOwner,
  };
};
