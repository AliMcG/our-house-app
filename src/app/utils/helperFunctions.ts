import { NavItemType } from "./navbarLinks"

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

  const foundItem = navItems.find(item => item.href === pathname);
  if (foundItem) {
    return foundItem.name;
  }

  return 'Unknown Route'; 
}