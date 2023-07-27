import { Router } from "express";
import approute from './app.route'

const router = Router();

const defaultRoutes = [
    {
        path:'/app',
        route: approute,
    }
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

export default router;