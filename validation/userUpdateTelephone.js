const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateTelephoneInput(data) {
  let errors = "";

  data.telephone = !isEmpty(data.telephone) ? data.telephone : "";

  if (Validator.isEmpty(data.telephone)) {
    errors = "Telephone is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
