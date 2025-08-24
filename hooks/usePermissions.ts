import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export function usePermissions() {
  const { user } = useUser();
  const permissions = useQuery(api.users.getUserPermissions, {});
  const hasAdminAccess = useQuery(api.users.hasAdminAccess, {});

  // Check if user has franchiseen.com email
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;
  const isFranchiseenEmail = userEmail?.endsWith('@franchiseen.com') || false;
  const isSuperAdmin = userEmail === 'shawaz@franchiseen.com';

  const hasPermission = (permission: string): boolean => {
    // Super admin has all permissions
    if (isSuperAdmin) return true;

    // Franchiseen.com emails have admin permissions
    if (isFranchiseenEmail) {
      return permission.startsWith('home.') || permission.startsWith('admin.') ||
             permission.startsWith('operations.') || permission.startsWith('finances.') ||
             permission.startsWith('people.');
    }

    // If functions are not yet available, provide basic access to home section
    if (!permissions) {
      return permission.startsWith('home.');
    }

    // Check for wildcard permission
    if (permissions.includes('*')) return true;

    // Check for exact permission match
    if (permissions.includes(permission)) return true;

    // Check for wildcard section match (e.g., 'home.*' matches 'home.tasks')
    const wildcardPermissions = permissions.filter(p => p.endsWith('.*'));
    for (const wildcardPerm of wildcardPermissions) {
      const section = wildcardPerm.replace('.*', '');
      if (permission.startsWith(section + '.')) return true;
    }

    return false;
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissionList: string[]): boolean => {
    return permissionList.every(permission => hasPermission(permission));
  };

  return {
    permissions: permissions || [],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasAdminAccess: hasAdminAccess || isFranchiseenEmail,
    isLoading: permissions === undefined || hasAdminAccess === undefined
  };
}

// Hook to check a specific permission
export function useHasPermission(permission: string) {
  const hasPermissionQuery = useQuery(api.users.hasPermission, { permission });
  return hasPermissionQuery || false;
}
