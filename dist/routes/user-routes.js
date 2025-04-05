"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRoutes = void 0;
const hono_1 = require("hono");
const users_types_js_1 = require("../controllers/users/users-types.js");
const token_middlewares_js_1 = require("./middlewares/token-middlewares.js");
const user_controllers_js_1 = require("../controllers/users/user-controllers.js");
const user_controllers_js_2 = require("../controllers/users/user-controllers.js");
exports.usersRoutes = new hono_1.Hono();
exports.usersRoutes.get("/me", token_middlewares_js_1.tokenMiddleware, async (context) => {
    const userId = context.get("userId");
    try {
        const user = await (0, user_controllers_js_1.getMe)({
            userId,
        });
        return context.json({
            data: user,
        }, 200);
    }
    catch (e) {
        if (e === users_types_js_1.getmeError.BAD_REQUEST) {
            return context.json({
                error: "User not found",
            }, 400);
        }
        return context.json({
            message: "Internal Server Error",
        }, 500);
    }
});
exports.usersRoutes.get("/getAllUsers", token_middlewares_js_1.tokenMiddleware, async (context) => {
    try {
        const users = await (0, user_controllers_js_2.getAllUsers)();
        return context.json(users, 200);
    }
    catch (e) {
        return context.json({ message: e }, 404);
    }
});
exports.usersRoutes.get("/getAllusers", token_middlewares_js_1.tokenMiddleware, async (context) => {
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    try {
        const result = await (0, user_controllers_js_2.getAllUsers)(page, limit);
        return context.json({
            data: result.user,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit),
            },
        }, 200);
    }
    catch (e) {
        return context.json({ message: e }, 404);
    }
});
