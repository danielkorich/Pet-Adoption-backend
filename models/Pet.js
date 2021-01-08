const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PetSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    isFostered: {
      type: Boolean,
      required: true,
    },
    isAdopted: {
      type: Boolean,
      required: true,
    },
    ownerId: {
      type: String,
      required: false,
    },
    height: {
      type: Number,
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    bio: {
      type: String,
      required: false,
    },
    hypoallergenic: {
      type: Boolean,
      required: true,
    },
    dietaryRest: {
      type: Boolean,
      required: true,
    },
  },
  { versionKey: false }
);

module.exports = Pet = mongoose.model("pets", PetSchema);
