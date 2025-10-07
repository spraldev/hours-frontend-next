export function getStaffErrorMessage(err: any): { message: string; isVerificationError: boolean } {
  let errorMessage = err.message || 'Please check your email and password and try again.'
  let isVerificationError = false

  const errorMsg = errorMessage.toLowerCase()
  if (errorMsg.includes('verify') && errorMsg.includes('email')) {
    errorMessage = 'Please verify your email address before logging in. Check your inbox for a verification link.'
    isVerificationError = true
  } else if (errorMsg.includes('invalid') || errorMsg.includes('incorrect') || errorMsg.includes('unauthorized')) {
    errorMessage = 'Invalid email or password. Please double-check your credentials.'
  } else if (errorMsg.includes('not found') || errorMsg.includes('user')) {
    errorMessage = 'Email not found. Please check your email or contact administration.'
  } else if (errorMsg.includes('pending') || errorMsg.includes('approval')) {
    errorMessage = 'Your account is pending approval. Please wait for administrator confirmation.'
  }

  return { message: errorMessage, isVerificationError }
}
