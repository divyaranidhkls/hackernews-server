"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sessionMiddleware = exports.authRoute = void 0;
const hono_1 = require("hono");
const factory_1 = require("hono/factory");
const index_js_1 = __importDefault(require("../../integrations/better-auth/index.js"));
exports.authRoute = new hono_1.Hono();
exports.authRoute.on(["GET", "POST"], "*", (context) => {
    return index_js_1.default.handler(context.req.raw);
});
exports.sessionMiddleware = (0, factory_1.createMiddleware)(async (context, next) => {
    const session = await index_js_1.default.api.getSession({ headers: context.req.raw.headers });
    if (!session) {
        return context.body(null, 401);
    }
    context.set("user", session.user);
    context.set("session", session.session);
    return await next();
});
