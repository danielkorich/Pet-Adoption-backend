const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validatePasswordInput(data) {
  let errors = "";

  data.password = !isEmpty(data.password) ? data.password : "";
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (Validator.isEmpty(data.password)) {
    errors = "Password is required!";
  }

  if (Validator.isEmpty(data.password2)) {
    errors = "Confirm password is required";
  }

  if (!Validator.isLength(data.password, { min: 6, max: 15 })) {
    errors = "The password must contain 6-15 characters!";
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors = "Passwords do not match!";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
