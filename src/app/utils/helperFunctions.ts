export const sanitiseTitleStringForURL = (title: string) => {
  /** trim any trailling whitespace from string */
  const trimmedTitle = title.trim()
  /** Format string to replace any whitespace with a hythen */
  const formattedTitle = trimmedTitle.replace(/\s+/g, '-')
  return formattedTitle
}

export const convertURLtoString = (title: string) => {
  /** Format string to replace any hythen with a whitespace */
  const formattedTitle = title.replace(/-/g, ' ')
  return formattedTitle
}