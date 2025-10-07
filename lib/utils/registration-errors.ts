export function getStudentRegistrationError(err: any): string {
  let userMessage = "Unable to create your account. Please try again."

  if (err.message) {
    const errorMsg = err.message.toLowerCase()
    if (errorMsg.includes("already exists") || errorMsg.includes("duplicate")) {
      userMessage = "An account with this Student ID or email already exists. Please try logging in instead."
    } else if (errorMsg.includes("invalid email") || errorMsg.includes("email")) {
      userMessage = "Please use a valid school email address ending in @stu.gusd.net."
    } else if (errorMsg.includes("password")) {
      userMessage = "Password must be at least 6 characters long. Please choose a stronger password."
    } else if (errorMsg.includes("student id") || errorMsg.includes("studentid")) {
      userMessage = "Invalid Student ID format. Please check your Student ID and try again."
    } else if (errorMsg.includes("network") || errorMsg.includes("connection")) {
      userMessage = "Connection problem. Please check your internet and try again."
    } else if (errorMsg.includes("server") || errorMsg.includes("internal")) {
      userMessage = "We're experiencing technical difficulties. Please try again in a few moments."
    }
  }

  return userMessage
}

export function getStaffRegistrationError(err: any): string {
  let userMessage = "Unable to submit your registration. Please try again."

  if (err.message) {
    const errorMsg = err.message.toLowerCase()
    if (errorMsg.includes("already exists") || errorMsg.includes("duplicate")) {
      userMessage = "An account with this email already exists. Please try logging in instead."
    } else if (errorMsg.includes("invalid email") || errorMsg.includes("email")) {
      userMessage = "Please use a valid organization email address."
    } else if (errorMsg.includes("password")) {
      userMessage = "Password must be at least 6 characters long. Please choose a stronger password."
    } else if (errorMsg.includes("verification") || errorMsg.includes("proof")) {
      userMessage = "Please provide valid verification information for your organization."
    } else if (errorMsg.includes("network") || errorMsg.includes("connection")) {
      userMessage = "Connection problem. Please check your internet and try again."
    } else if (errorMsg.includes("server") || errorMsg.includes("internal")) {
      userMessage = "We're experiencing technical difficulties. Please try again in a few moments."
    }
  }

  return userMessage
}
