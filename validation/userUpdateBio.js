const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateBioInput(data) {
  let errors = "";
  
  if (!Validator.isLength(data.bio, { min: 0, max: 40 })) {
    errors = "Bio cannot contain more than 40 chars.";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
