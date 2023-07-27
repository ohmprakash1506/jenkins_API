import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";

const jenkinsUrl = "http://localhost:8080";
export default class jenkins {
  allJobs = async (req: Request, res: Response) => {
    const { jobName } = req.params;

    try {
      const jenkinsJobAPI = `${jenkinsUrl}/api/json`;
      console.log(jenkinsJobAPI);
      const response: AxiosResponse = await axios.get(jenkinsJobAPI);
      res.json(response.data.json);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: `Error..! failed to fetch jenkins data` });
    }
  };
}
