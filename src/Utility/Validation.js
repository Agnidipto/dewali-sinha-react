export const validatePassword = (password) => {
  var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
  return strongRegex.test(password);
};
