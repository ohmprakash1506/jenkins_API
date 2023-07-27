import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import { buffer } from "stream/consumers";

const jenkinsUrl = "http://localhost:8080";
const username = "jenkins1506";
const password = "ohm97877";

export default class jenkins {
  allJobs = async (req: Request, res: Response) => {
    const { jobName } = req.params;

    try {
      const jenkinsJobAPI = `${jenkinsUrl}/api/json`;
      const response: AxiosResponse = await axios.get(jenkinsJobAPI, {
        auth: {
          username,
          password,
        },
      });
      console.log(response);
      res.status(200).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Error..! failed to fetch jenkins data` });
    }
  };
}
