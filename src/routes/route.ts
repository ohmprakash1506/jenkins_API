import { Router } from "express";
import approute from './app.route'
import jenkinsRoute from './jenkins.route'

const router = Router();

const defaultRoutes = [
    {
        path:'/app',
        route: approute,
    },
    {
        path: '/jenkinsRoute',
        route: jenkinsRoute
    }
]

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route)
})

export default router;