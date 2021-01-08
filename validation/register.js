const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.telephone = !isEmpty(data.telephone) ? data.telephone : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "Fisrt Name is required";
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Last Name is required";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }

  if (Validator.isEmpty(data.telephone)) {
    errors.telephone = "Telephone field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  if (Validator.isEmpty(data.password2)) {
    errors.passwordVer = "Confirm password field is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 15 })) {
    errors.password = "The password must contain 6-15 characters!";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password = "Passords don't match!";
    errors.passwordVer = "Passords don't match!";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
