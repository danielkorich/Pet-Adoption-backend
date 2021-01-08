const express = require("express");
const router = express.Router();
const passport = require("passport");

const {
  Register,
  Login,
  UpdateEmail,
  UpdatePassword,
  UpdateName,
  UpdateTelephone,
  UpdateBio,
  getAllUsers,
  getUserDetails
} = require("../controllers/userCtrl");

router.post("/register", Register);
router.post("/login", Login);
router.put(
  "/updateemail",
  passport.authenticate("jwt", { session: false }),
  UpdateEmail
);
router.put(
  "/updatepassword",
  passport.authenticate("jwt", { session: false }),
  UpdatePassword
);
router.put(
  "/updatename",
  passport.authenticate("jwt", { session: false }),
  UpdateName
);
router.put(
  "/updatetelephone",
  passport.authenticate("jwt", { session: false }),
  UpdateTelephone
);
router.put(
  "/updatebio",
  passport.authenticate("jwt", { session: false }),
  UpdateBio
);

router.get(
  "/getallusers",
  passport.authenticate("jwt", { session: false }),
  getAllUsers
);

router.get(
  "/userdetails/:id",
  passport.authenticate("jwt", { session: false }),
  getUserDetails
);

module.exports = router;
