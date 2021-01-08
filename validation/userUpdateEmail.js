const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateEmailInput(data) {
  let errors = "";

  data.email = !isEmpty(data.email) ? data.email : "";

  if (Validator.isEmpty(data.email)) {
    errors = "Email is required!";
  } else if (!Validator.isEmail(data.email)) {
    errors = "Please enter valid email address.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
