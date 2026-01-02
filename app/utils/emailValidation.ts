/**
 * Validates email format and domain
 * @param email - Email address to validate
 * @param domain - Required domain (e.g., '@iscoollab.com')
 * @returns Object with isValid flag and error message if invalid
 */
export interface EmailValidationResult {
  isValid: boolean
  error?: string
}

export function validateEmailDomain(
  email: string,
  domain: string = '@iscoollab.com'
): EmailValidationResult {
  // Trim whitespace
  const trimmedEmail = email.trim()

  // Check if email is empty
  if (!trimmedEmail) {
    return {
      isValid: false,
      error: 'Email address is required',
    }
  }

  // Basic email format validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(trimmedEmail)) {
    return {
      isValid: false,
      error: 'Invalid email format',
    }
  }

  // Check if email ends with the required domain
  const normalizedEmail = trimmedEmail.toLowerCase()
  const normalizedDomain = domain.toLowerCase()

  if (!normalizedEmail.endsWith(normalizedDomain)) {
    return {
      isValid: false,
      error: `Email must be from ${domain} domain`,
    }
  }

  return {
    isValid: true,
  }
}
