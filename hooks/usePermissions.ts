import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

export function usePermissions() {
  const { user } = useUser();
  const permissions = useQuery(api.users.getUserPermissions, {});
  const hasAdminAccess = useQuery(api.users.hasAdminAccess, {});
  const platformUser = useQuery(api.platformTeam.getCurrentPlatformUser, {});

  // Check if user has franchiseen.com email
  const userEmail = user?.emailAddresses?.[0]?.emailAddress;
  const isFranchiseenEmail = userEmail?.endsWith('@franchiseen.com') || false;
  const isSuperAdmin = userEmail === 'shawaz@franchiseen.com';

  const hasPermission = (permission: string): boolean => {
    // Super admin has all permissions
    if (isSuperAdmin) return true;

    // Check platform team member permissions first
    if (platformUser?.platformMember?.isActive) {
      const memberPermissions = platformUser.platformMember.permissions || [];

      // Check for wildcard permission
      if (memberPermissions.includes('*')) return true;

      // Check for exact permission match
      if (memberPermissions.includes(permission)) return true;

      // Check for wildcard section match (e.g., 'home.*' matches 'home.tasks')
      const wildcardPermissions = memberPermissions.filter(p => p.endsWith('.*'));
      for (const wildcardPerm of wildcardPermissions) {
        const section = wildcardPerm.replace('.*', '');
        if (permission.startsWith(section + '.')) return true;
      }
    }

    // Fallback: All Franchiseen.com emails have home access
    if (isFranchiseenEmail && permission.startsWith('home.')) {
      return true;
    }

    // If functions are not yet available, provide basic access to home section for franchiseen emails
    if (!permissions && isFranchiseenEmail) {
      return permission.startsWith('home.');
    }

    // Check legacy permissions system
    if (permissions) {
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
    }

    return false;
  };

  const hasAnyPermission = (permissionList: string[]): boolean => {
    return permissionList.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissionList: string[]): boolean => {
    return permissionList.every(permission => hasPermission(permission));
  };

  const hasDepartmentAccess = (department: string): boolean => {
    // Super admin has access to all departments
    if (isSuperAdmin) return true;

    // Home department is open to all Franchiseen members
    if (department === 'home' && isFranchiseenEmail) return true;

    // Check platform team member department access
    if (platformUser?.departmentAccess) {
      return platformUser.departmentAccess.includes(department);
    }

    return false;
  };

  return {
    permissions: permissions || [],
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasDepartmentAccess,
    hasAdminAccess: hasAdminAccess || isFranchiseenEmail,
    isLoading: permissions === undefined || hasAdminAccess === undefined,
    platformUser,
    departmentAccess: platformUser?.departmentAccess || (isFranchiseenEmail ? ['home'] : [])
  };
}

// Hook to check a specific permission
export function useHasPermission(permission: string) {
  const hasPermissionQuery = useQuery(api.users.hasPermission, { permission });
  return hasPermissionQuery || false;
}
