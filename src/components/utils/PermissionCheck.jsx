import { useSelector } from 'react-redux';

export const useHasPermission = (permissionKey) => {
  const permissions = useSelector((state) => state.auth.permissions || []);
  return permissions.includes(permissionKey);
};
