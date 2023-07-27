import express, { Request, Response } from "express";
import axios from "axios";
import route from "./routes/route";
import { scheduleCronJobs } from "./cornJob";

const app = express();
const port = process.env.PORT || 3000;

scheduleCronJobs();

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running at port: ${port}`);
});

app.use("/api/v1", route);
