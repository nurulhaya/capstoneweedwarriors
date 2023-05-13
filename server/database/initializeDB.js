import Sequelize from "sequelize";
const { DataTypes } = Sequelize;
import modelList from "../models/index.js";
import * as dotenv from "dotenv";

dotenv.config();

const sequelizeDB = new Sequelize(process.env.PGURI, {
  // logging: false,
});

try {
  await sequelizeDB.authenticate();
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

const db = Object.keys(modelList).reduce((collection, modelName) => {
  if (!collection[modelName]) {
    collection[modelName] = modelList[modelName](sequelizeDB, DataTypes);
  }
  return collection;
}, {});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelizeDB = sequelizeDB;
db.Sequelize = Sequelize;

export default db;
