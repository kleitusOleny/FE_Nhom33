export function checkPasswordCriteria(password: string, rePassword: string) {
    return {
      hasMinLength: password.length >= 8,
      hasUpperLower: /[A-Z]/.test(password) && /[a-z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasNumber: /\d/.test(password),
      isMatched: password.length > 0 && password === rePassword,
    };
  }