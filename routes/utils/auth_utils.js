// list of viable countries
const countries = require("./countries.json").map((country) => {
  return {
    name: country.name.common,
  };
});

async function checkUsername(username) {
  regex = /[^A-Za-z]/; // username can only contain letters

  if (username.length < 3 || username.length > 8) {
    throw { status: 400, message: "Username must be between 3 and 8 characters" };
  }
  if (regex.test(username)) {
    throw { status: 400, message: "Username can only contain letters" };
  }
}

async function checkPassword(password) {
  regex = /^(?=.*\d)(?=.*[^A-Za-z0-9]).+$/ // password must contain at least one digit and one special character

  if (password.length < 5 || password.length > 10) {
    throw { status: 400, message: "Password must be between 5 and 10 characters" };
  }
  if (!regex.test(password)) {
    throw { status: 400, message: "Password must contain at least one digit and one special character" };
  }
}

async function checkPasswordsMatch(password, password_confirm) {
  if (password !== password_confirm) {
    throw { status: 400, message: "Passwords do not match" };
  }
}

async function checkCountry(country) {
  if (!countries.find((x) => x.name === country)) {
    throw { status: 400, message: "Country is not valid" };
  }
}

exports.checkUsername = checkUsername;
exports.checkPassword = checkPassword;
exports.checkPasswordsMatch = checkPasswordsMatch;
exports.checkCountry = checkCountry;