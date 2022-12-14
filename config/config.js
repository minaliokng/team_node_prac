require("dotenv").config();

const {DBAddress, DBHost, DBPw, DB_dev, DB_test} = process.env;

module.exports = {
  "development": {
    "username": DBHost,
    "password": DBPw,
    "database": DB_dev,
    "host": DBAddress,
    "dialect": "mysql"
  },
  "test": {
    "username": DBHost,
    "password": DBPw,
    "database": DB_test,
    "host": DBAddress,
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
}
