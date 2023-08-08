import mongoose from "mongoose";
import 'dotenv/config'

require('dotenv').config()

const mongoUser = process.env.MONGO_DB_USER;
const mongoPass = process.env.MONGO_DB_PASS;
const mongoDb = process.env.MONGO_DB_DATABASE;
const mongoHost = process.env.MONGO_DB_URL 

mongoose.connect(`mongodb://${mongoUser}:${mongoPass}@${mongoHost}/${mongoDb}`)