import { Router } from "express";
import approutcontroller from "../controllers/appRoute.controller";

const route = Router();
const app = new approutcontroller()

route.get('/console', app.console);

export default route;