import { Hono } from "hono";
import { getmeError, } from "../controllers/users/users-types.js";
import { tokenMiddleware } from "./middlewares/token-middlewares.js";
import { getMe } from "../controllers/users/user-controllers.js";
import { getAllUsers } from "../controllers/users/user-controllers.js";
export const usersRoutes = new Hono();
usersRoutes.get("/me", tokenMiddleware, async (context) => {
    const userId = context.get("userId");
    try {
        const user = await getMe({
            userId,
        });
        return context.json({
            data: user,
        }, 200);
    }
    catch (e) {
        if (e === getmeError.BAD_REQUEST) {
            return context.json({
                error: "User not found",
            }, 400);
        }
        return context.json({
            message: "Internal Server Error",
        }, 500);
    }
});
usersRoutes.get("/getAllUsers", tokenMiddleware, async (context) => {
    try {
        const users = await getAllUsers();
        return context.json(users, 200);
    }
    catch (e) {
        return context.json({ message: e }, 404);
    }
});
usersRoutes.get("/getAllusers", tokenMiddleware, async (context) => {
    const page = Number(context.req.query("page") || 1);
    const limit = Number(context.req.query("limit") || 10);
    try {
        const result = await getAllUsers(page, limit);
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
