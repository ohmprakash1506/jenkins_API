import { Request, Response } from "express";

export default class approutcontroller {
  console = async (req: Request, res: Response) => {
    try {
      console.log(`Hello jenkins API.....!`);
      res.json(`Hello jenkins API.....!`);
    } catch (error) {
      return error;
    }
  };
}
