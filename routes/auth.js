var express = require("express");
var router = express.Router();
const MySql = require("../routes/utils/MySql");
const DButils = require("../routes/utils/DButils");
const auth_utils = require("../routes/utils/auth_utils");
const bcrypt = require("bcrypt");
const { check } = require("express-validator");



router.post("/register", async (req, res, next) => {
  try {
    // parameters exists
    // valid parameters
    // username exists
    let user_details = {
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      country: req.body.country,
      password: req.body.password,
      password_confirm: req.body.password_confirm,
      email: req.body.email,
      profilePic: req.body.profilePic
    }
    let users = [];
    users = await DButils.execQuery("SELECT username from users");

    // check that username is valid
    await auth_utils.checkUsername(user_details.username);

    await auth_utils.checkPassword(user_details.password); // check that password is valid
    await auth_utils.checkPasswordsMatch(user_details.password, user_details.password_confirm); // check that passwords match

    await auth_utils.checkCountry(user_details.country); // check that country is valid

    // Check that username is not taken
    if (users.find((x) => x.username === user_details.username))
      throw { status: 409, message: "Username taken" };

    // add the new username
    let hash_password = bcrypt.hashSync(
      user_details.password,
      parseInt(process.env.bcrypt_saltRounds)
    );

    await DButils.execQuery(
      `INSERT INTO users (username, firstname, lastname, country, password, email, profile_pic) VALUES ('${user_details.username}', '${user_details.firstname}', '${user_details.lastname}',
      '${user_details.country}', '${hash_password}', '${user_details.email}', '${user_details.profilePic}')`
    );

    res.status(201).send({ message: "User created", success: true });
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    // check that username exists
    const users = await DButils.execQuery("SELECT username FROM users");
    if (!users.find((x) => x.username === req.body.username))
      throw { status: 401, message: "Username or Password incorrect" };

    // check that the password is correct
    const user = (
      await DButils.execQuery(
        `SELECT * FROM users WHERE username = '${req.body.username}'`
      )
    )[0];

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      throw { status: 401, message: "Username or Password incorrect" };
    }

    // check if user is already logged in
    if (req.session.user_id) {
      throw {status: 400, message: "User already logged in" };
    }

    // Set cookie
    req.session.user_id = user.user_id;
    console.log("session user_id login: " + req.session.user_id);

    // return cookie
    res.status(200).send({ message: "login success" , success: true });
  } catch (error) {
    next(error);
  }
});


router.post("/logout", function (req, res) {
  console.log("session user_id Logout: " + req.session.user_id);
  req.session.reset(); // reset the session info --> send cookie when  req.session == undefined!!
  res.status(200).send({ message: "logout success", success: true});
});


module.exports = router;