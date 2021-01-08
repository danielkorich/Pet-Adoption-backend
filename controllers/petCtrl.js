const cloudinary = require("cloudinary");
const Pet = require("../models/Pet");
const User = require("../models/User");

const validatePet = require("../validation/validatePet");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CONFIG_NAME,
  api_key: process.env.CLOUDINARY_CONFIG_KEY,
  api_secret: process.env.CLOUDINARY_CONFIG_SECRET,
});

const addNewPet = async (req, res) => {
  const { errors, isValid } = validatePet(req.body);
  const isAdmin = req.user.isAdmin;
  if (!isAdmin) {
    return res.status(403).json("Forbidden!");
  } else {
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let cloud = {};
    if (req.file) {
      cloud = await cloudinary.v2.uploader
        .upload(req.file.path, {
          width: 300,
          height: 300,
          background: "white",
          crop: "pad",
        })
        .catch((err) => {
          return res.status(500).json("Error uploading photo");
        });
    }
    const newPet = new Pet({
      name: req.body.name,
      type: req.body.type,
      breed: req.body.breed,
      color: req.body.color,
      imageUrl: cloud.url ? cloud.url : "",
      isFostered: false,
      isAdopted: false,
      ownerId: "",
      height: req.body.height,
      weight: req.body.weight,
      bio: req.body.bio,
      hypoallergenic: req.body.hypoallergenic,
      dietaryRest: req.body.dietaryRest,
    });

    newPet
      .save()
      .then((pet) => {
        res.json({
          pet: pet,
        });
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json("Server Error");
      });
  }
};

const editPet = async (req, res) => {
  const { errors, isValid } = validatePet(req.body);
  const isAdmin = req.user.isAdmin;
  if (!isAdmin) {
    return res.status(403).json("Forbidden!");
  } else {
    if (!isValid) {
      return res.status(400).json(errors);
    }
    let cloud = {};
    if (req.file) {
      cloud = await cloudinary.v2.uploader
        .upload(req.file.path, {
          width: 300,
          height: 300,
          background: "white",
          crop: "pad",
        })
        .catch((err) => {
          return res.status(500).json("Error uploading photo");
        });
    }

    Pet.findOne({ _id: req.body.id })
      .then((pet) => {
        if (!pet) {
          return res.status(400).json("Pet not found!");
        }
        if (pet) {
          pet.name = req.body.name;
          pet.type = req.body.type;
          pet.breed = req.body.breed;
          pet.color = req.body.color;
          pet.height = req.body.height;
          pet.weight = req.body.weight;
          pet.bio = req.body.bio;
          pet.hypoallergenic = req.body.hypoallergenic;
          pet.dietaryRest = req.body.dietaryRest;
          if (cloud.url) {
            pet.imageUrl = cloud.url;
          }
          pet.save().then((pet) => {
            return res.json(pet);
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json("Server Error");
      });
  }
};

const getPetByQuery = (req, res) => {
  const query = req.query;
  let mongooseQuery = {};
  if (query.name) {
    mongooseQuery.name = query.name;
  }
  if (query.type) {
    mongooseQuery.type = query.type;
  }
  if (query.breed) {
    mongooseQuery.breed = query.breed;
  }
  if (query.color) {
    mongooseQuery.color = query.color;
  }
  if (query.heightMin) {
    mongooseQuery.height = { $gte: query.heightMin };
  }
  if (query.heightMax) {
    mongooseQuery.height = { $lte: query.heightMax };
  }
  if (query.weightMin) {
    mongooseQuery.weight = { $gte: query.weightMin };
  }
  if (query.weightMax) {
    mongooseQuery.weight = { $lte: query.weightMax };
  }
  if (query.hypoallergenic) {
    mongooseQuery.hypoallergenic = query.hypoallergenic;
  }
  if (query.dietaryRest) {
    mongooseQuery.dietaryRest = query.dietaryRest;
  }
  if (query.isAvailable) {
    mongooseQuery.isAdopted = false;
    mongooseQuery.isFostered = false;
  }

  Pet.find(mongooseQuery, { ownerId: 0 })
    .then((pets) => {
      if (pets.length) {
        return res.json(pets);
      } else return res.status(400).json("No pets Found!");
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("Server Error");
    });
};

const getPetById = (req, res) => {
  const _id = req.params.id;
  Pet.findOne({ _id })
    .then((pet) => {
      if (pet) {
        return res.json(pet);
      } else return res.status(400).json("Pet Not Found!");
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("Server Error");
    });
};

const getLikedPets = (req, res) => {
  res.json(req.user.likedPets);
};

const adoptPet = (req, res) => {
  const petid = req.params.id;
  const id = req.user.id;
  Pet.findOne({ _id: petid })
    .then((pet) => {
      if (!pet) {
        return res.status(400).json("Pet not found!");
      }
      if (pet) {
        if (pet.isAdopted) {
          if (pet.ownerId === id) {
            return res.status(400).json("This is your pet!");
          } else {
            return res.status(400).json("Pet is already adopted!");
          }
        } else if (pet.isFostered && pet.ownerId !== id) {
          return res.status(400).json("Pet is beeing fostered by someone!");
        } else {
          pet.ownerId = id;
          pet.isAdopted = true;
          pet.isFostered = false;
          pet.save().then((pet) => {
            return res.json(pet);
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("Server Error");
    });
};

const fosterPet = (req, res) => {
  const petid = req.params.id;
  const id = req.user.id;
  Pet.findOne({ _id: petid })
    .then((pet) => {
      if (!pet) {
        return res.status(400).json("Pet not found!");
      }
      if (pet) {
        if (pet.isAdopted) {
          return res.status(400).json("Pet is already adopted!");
        } else if (pet.isFostered) {
          if (pet.ownerId == id) {
            return res
              .status(400)
              .json("Pet is already beeing fostered by you!");
          } else {
            return res.status(400).json("Pet is beeing fostered by someone!");
          }
        } else {
          pet.ownerId = id;
          pet.isFostered = true;
          pet.save().then((pet) => {
            return res.json(pet);
          });
        }
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("Server Error");
    });
};

const returnPet = (req, res) => {
  const petid = req.params.id;
  const id = req.user.id;
  Pet.findOne({ _id: petid })
    .then((pet) => {
      if (!pet) {
        return res.status(400).json("Pet not found!");
      }
      if (pet) {
        if (pet.ownerId == id) {
          pet.ownerId = "";
          pet.isFostered = false;
          pet.isAdopted = false;
          pet.save().then((pet) => {
            return res.json(pet);
          });
        } else {
          res.status(400).json("This is not your pet");
        }
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("Server Error");
    });
};

const likePet = (req, res) => {
  const petId = req.params.id;
  const _id = req.user.id;
  User.findOne({ _id })
    .then((user) => {
      if (!user.likedPets || user.likedPets.indexOf(petId) < 0) {
        user.likedPets.push(petId);
        user.save().then((user) => {
          return res.json(user.likedPets);
        });
      } else {
        res.status(400).json("This Pet is already liked");
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("Server Error");
    });
};

const unlikePet = (req, res) => {
  const petId = req.params.id;
  const _id = req.user.id;
  User.findOne({ _id })
    .then((user) => {
      if (!user.likedPets || user.likedPets.indexOf(petId) < 0) {
        res.status(400).json("Pet not listed at LikedPets");
      } else {
        user.likedPets = user.likedPets.filter((e) => e !== petId);
        user.save().then((user) => {
          return res.json(user.likedPets);
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("Server Error");
    });
};

getListLikedPetsInfo = (req, res) => {
  const likedpets = req.user.likedPets;
  if (!likedpets.length) {
    return res.status(400).json("You don't have any liked pets!");
  } else {
    Pet.find({ _id: { $in: likedpets } })
      .then((pets) => {
        return res.json(pets);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json("Server Error");
      });
  }
};

getListPetsInfo = (req, res) => {
  const id = req.user._id;
  Pet.find({ ownerId: id })
    .then((pets) => {
      if (!pets.length) {
        return res.status(400).json("You don't have any pets!");
      } else {
        return res.json(pets);
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("Server Error");
    });
};

module.exports = {
  addNewPet: addNewPet,
  getPetByQuery: getPetByQuery,
  getPetById: getPetById,
  getLikedPets: getLikedPets,
  adoptPet: adoptPet,
  fosterPet: fosterPet,
  returnPet: returnPet,
  likePet: likePet,
  unlikePet: unlikePet,
  getListLikedPetsInfo: getListLikedPetsInfo,
  getListPetsInfo: getListPetsInfo,
  editPet: editPet,
};
