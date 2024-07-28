export const isValidEmail = (email: string) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return email.length !== 0 && emailPattern.test(email)
}

export const isValidUsername = (username: string) => {
  const usernamePattern = /^[a-zA-Z0-9]{6,}$/;
  return usernamePattern.test(username);
};
