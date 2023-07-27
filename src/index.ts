import express, { Request, Response } from "express";
import route from "./routes/route";
import { scheduleCronJobs } from "./cornJob";
import 'dotenv/config'

require('dotenv').config()
const app = express();
const port = process.env.PORT_NUMBER;

scheduleCronJobs();

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});

app.use("/api/v1", route);
