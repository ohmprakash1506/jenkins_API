"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appRoute_controller_1 = __importDefault(require("../controllers/appRoute.controller"));
const route = (0, express_1.Router)();
const app = new appRoute_controller_1.default();
route.get('/console', app.console);
exports.default = route;
