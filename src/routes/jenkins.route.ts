import { Router } from "express";
import jenkins from "../controllers/jenkins.controller";

const router = Router();
const jenkinsRoute = new jenkins()

router.get('/jenkins/list')