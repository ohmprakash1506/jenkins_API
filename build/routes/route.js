"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const app_route_1 = __importDefault(require("./app.route"));
const router = (0, express_1.Router)();
const defaultRoutes = [
    {
        path: '/app',
        route: app_route_1.default,
    }
];
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
