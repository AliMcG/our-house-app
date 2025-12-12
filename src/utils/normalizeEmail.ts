// Tackles a known Google mail account problem 
// where in some regions `user@googlemail.com` was used and 
// for the rest `user@gmail.com`. This can cause issues when 
// inviting users to join household so lets fix it.
/**
 * Standardize and Normalize all Google mail addresses to 'gmail.com'
 */
export function normalizeEmail(email: string): string {
  if (email.endsWith('@googlemail.com')) {
    const lowercased = email.toLowerCase().trim();
    return lowercased.replace('@googlemail.com', '@gmail.com');
  }
  // all others are kept as they are
  return email;
}