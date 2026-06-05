/**
 * Utility to retrieve CSRF tokens.
 * In Rails applications using cookie/session auth, non-GET requests require a CSRF token.
 * This helper searches for the token in the document meta tags (if SSR/embedded) or document cookies.
 */
export const getCsrfToken = (): string | null => {
  if (typeof window === 'undefined') return null

  // 1. Try to read from meta tags (common in Rails-embedded views)
  const meta = document.querySelector('meta[name="csrf-token"]')
  if (meta) {
    const token = meta.getAttribute('content')
    if (token) return token
  }

  // 2. Try to read from cookie (common in API/SPA setups with session cookie)
  const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/)
  if (match) {
    return decodeURIComponent(match[1])
  }

  return null
}
