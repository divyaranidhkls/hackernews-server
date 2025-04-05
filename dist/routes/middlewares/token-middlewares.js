"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenMiddleware = void 0;
const factory_1 = require("hono/factory");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const environment_js_1 = require("../../environment.js");
exports.tokenMiddleware = (0, factory_1.createMiddleware)(async (context, next) => {
    const token = context.req.header("token");
    if (!token) {
        return context.json({
            message: "Missing Token",
        }, 401);
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, environment_js_1.jwtSecretKey);
        const userId = payload.sub;
        if (userId) {
            context.set("userId", userId);
        }
        else {
            return context.json({
                message: "Invalid Token",
            }, 401);
        }
        await next();
    }
    catch (e) {
        return context.json({
            message: "Missing Token",
        }, 401);
    }
});
