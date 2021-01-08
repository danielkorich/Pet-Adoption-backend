const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateNameInput(data) {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
  data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
  
  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = "Fisrt Name is required!";
  }

  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = "Last Name is required!";
  }
  
  return {
    errors,
    isValid: isEmpty(errors)
  };
};
