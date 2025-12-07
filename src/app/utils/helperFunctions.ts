import type { NavItemType } from "./navigation-links"

/**
 * Formats a string to replace any whitespace with a hythen
 * @param string 
 * @returns 
 */
export const sanitiseStringForURL = (string: string) => {
  const trimmedTitle = string.trim()
  const formattedTitle = trimmedTitle.replace(/\s+/g, '-')
  return formattedTitle
}

/**
 * Format string to replace any hythen with a whitespace
 * @param string string to be converted
 * @returns string
 */
export const convertURLtoString = (string: string) => {
  const formattedTitle = string.replace(/-/g, ' ')
  return formattedTitle
}

/**
 * Returns the matching route name for a given pathname
 * @param pathname 
 * @param navItems 
 * @returns 
 */
export function getRouteName(pathname: string, navItems: NavItemType[]) {
  if (!pathname) {
    return '';
  }

   const exactMatch = navItems.find(item => item.href === pathname);
  if (exactMatch) {
    return exactMatch.name;
  }

  // Then, try for a prefix match (for nested/dynamic routes)
  const prefixMatch = navItems.find(item => pathname.startsWith(item.href));
  if (prefixMatch) {
    return prefixMatch.name;
  }

  return 'Unknown Route';
}