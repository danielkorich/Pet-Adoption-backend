const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "./config/.env") });
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
const port = 5000;
const userRouter = require("./routes/users");
const petRouter = require("./routes/pets");

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
const db = process.env.MONGO_URI;

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    retryWrites: true,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log(err));

app.use(passport.initialize());

require("./config/passport")(passport);

app.use("/api/users", userRouter);

app.use("/api/pets", petRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
