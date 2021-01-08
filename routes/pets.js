const upload = require("../config/multer");
const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  addNewPet,
  getPetByQuery,
  getPetById,
  adoptPet,
  fosterPet,
  returnPet,
  getLikedPets,
  likePet,
  unlikePet,
  getListLikedPetsInfo,
  getListPetsInfo,
  editPet,
} = require("../controllers/petCtrl");

router.post(
  "/add",
  upload.single("image"),
  passport.authenticate("jwt", { session: false }),
  addNewPet
);
router.put(
  "/edit",
  upload.single("image"),
  passport.authenticate("jwt", { session: false }),
  editPet
);
router.get("/query:id?", getPetByQuery);
router.get("/id/:id", getPetById);
router.get(
  "/getlikedpets",
  passport.authenticate("jwt", { session: false }),
  getLikedPets
);

router.post(
  "/:id/adopt",
  passport.authenticate("jwt", { session: false }),
  adoptPet
);
router.post(
  "/:id/foster",
  passport.authenticate("jwt", { session: false }),
  fosterPet
);
router.post(
  "/:id/return",
  passport.authenticate("jwt", { session: false }),
  returnPet
);

router.post(
  "/:id/likepet",
  passport.authenticate("jwt", { session: false }),
  likePet
);

router.post(
  "/:id/unlikepet",
  passport.authenticate("jwt", { session: false }),
  unlikePet
);

router.get(
  "/getlistlikedpetsinfo",
  passport.authenticate("jwt", { session: false }),
  getListLikedPetsInfo
);

router.get(
  "/getlistpetsinfo",
  passport.authenticate("jwt", { session: false }),
  getListPetsInfo
);

module.exports = router;
