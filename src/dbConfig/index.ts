import mongoose, { ConnectOptions } from "mongoose";
import "dotenv/config";

require("dotenv").config();

const mongoURL = process.env.MONGO_DB_URL;
const mongoDB = process.env.MONGO_DB_NAME;

const dataBaseUrl = `${mongoURL}/${mongoDB}`;

const options: any = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(dataBaseUrl, options)
  .then(() => {
    console.log(`Connected to mongoDb at host : ${dataBaseUrl}`);
  })
  .catch((error) => {
    console.log(`Mongo DB connection error: `, error);
  });

const db = mongoose.connection;

db.on("disconnected", () => {
  console.log(`Disconnected from Mongo DB`);
});

export default db;
