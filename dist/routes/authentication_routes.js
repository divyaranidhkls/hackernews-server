"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationRoutes = void 0;
const hono_1 = require("hono");
const authentication_types_js_1 = require("../controllers/authentication/authentication-types.js");
const authentication_controllers_js_1 = require("../controllers/authentication/authentication-controllers.js");
const authentication_controllers_js_2 = require("../controllers/authentication/authentication-controllers.js");
exports.authenticationRoutes = new hono_1.Hono();
exports.authenticationRoutes.post("/sign-up", async (context) => {
    const { username, password, email } = await context.req.json();
    try {
        const result = await (0, authentication_controllers_js_1.signUpWithUsernameAndPassword)({
            username,
            password,
            email,
        });
        return context.json({
            data: result,
        }, 201);
    }
    catch (e) {
        if (e === authentication_types_js_1.SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME) {
            return context.json({
                message: "Username already exists",
            }, 409);
        }
        return context.json({
            mesage: "Unknown",
        }, 500);
    }
});
exports.authenticationRoutes.post("/log-in", async (context) => {
    const { username, password } = await context.req.json();
    try {
        const result = await (0, authentication_controllers_js_2.logInWithUsernameAndPassword)({
            username,
            password,
        });
        return context.json({
            data: result,
        }, 201);
    }
    catch (e) {
        if (e === authentication_types_js_1.SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME) {
            return context.json({
                message: "Username already exists",
            }, 409);
        }
        return context.json({
            mesage: "Unknown",
        }, 500);
    }
});
