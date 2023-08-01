import { Router } from "express";
import jenkins from "../controllers/jenkins.controller";

const router = Router();
const jenkinsRoute = new jenkins();

router.get('/jenkins/list', jenkinsRoute.allJobs);
router.post('/jenkins/create', jenkinsRoute.createJob);
router.delete('/jenkins/', jenkinsRoute.deleteJob);

export default router;