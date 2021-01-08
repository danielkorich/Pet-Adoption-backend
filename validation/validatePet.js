const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validatePet(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.type = !isEmpty(data.type) ? data.type : "";
  data.breed = !isEmpty(data.breed) ? data.breed : "";
  data.color = !isEmpty(data.color) ? data.color : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Name is required";
  }

  if (Validator.isEmpty(data.type)) {
    errors.type = "Type is required";
  }

  if (Validator.isEmpty(data.breed)) {
    errors.breed = "Breed is required";
  }

  if (Validator.isEmpty(data.color)) {
    errors.color = "Color is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
