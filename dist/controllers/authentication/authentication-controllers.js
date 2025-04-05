"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logInWithUsernameAndPassword = exports.signUpWithUsernameAndPassword = exports.checIfUserExistsAlready = void 0;
const crypto_1 = require("crypto");
const authentication_types_js_1 = require("./authentication-types.js");
const authentication_types_js_2 = require("./authentication-types.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_js_1 = require("../../extra/prisma.js");
const environment_js_1 = require("../../environment.js");
const createJWToken = (parameters) => {
    // Generate token
    const jwtPayload = {
        iss: "https://purpleshorts.co.in",
        sub: parameters.id,
        username: parameters.username,
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, environment_js_1.jwtSecretKey, {
        expiresIn: "30d",
    });
    return token;
};
const checIfUserExistsAlready = async (parameters) => {
    const ExistingUser = await prisma_js_1.prismaClient.user.findUnique({
        where: {
            username: parameters.username,
        },
    });
    if (ExistingUser) {
        return true;
    }
    return false;
};
exports.checIfUserExistsAlready = checIfUserExistsAlready;
const signUpWithUsernameAndPassword = async (parameters) => {
    try {
        const isUserExistingAlready = await (0, exports.checIfUserExistsAlready)({
            username: parameters.username,
        });
        if (isUserExistingAlready) {
            throw authentication_types_js_1.SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
        }
        const passwordHash = (0, crypto_1.createHash)("sha256")
            .update(parameters.password)
            .digest("hex");
        const user = await prisma_js_1.prismaClient.user.create({
            data: {
                username: parameters.username,
                password: passwordHash,
                email: parameters.email,
            },
        });
        const token = createJWToken({
            id: user.id,
            username: user.username,
        });
        const result = {
            token,
            user,
        };
        return result;
    }
    catch (e) {
        throw authentication_types_js_1.SignUpWithUsernameAndPasswordError.UNKNOWN;
    }
};
exports.signUpWithUsernameAndPassword = signUpWithUsernameAndPassword;
const logInWithUsernameAndPassword = async (parameters) => {
    try {
        const passwordHash = (0, crypto_1.createHash)("sha256")
            .update(parameters.password)
            .digest("hex");
        const user = await prisma_js_1.prismaClient.user.findUnique({
            where: {
                username: parameters.username,
                password: passwordHash,
            },
        });
        if (!user) {
            throw authentication_types_js_2.LogInWtihUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
        }
        const token = createJWToken({
            id: user.id,
            username: user.username,
        });
        return {
            token,
            user,
        };
    }
    catch (e) {
        console.log("Error", e);
        throw authentication_types_js_2.LogInWtihUsernameAndPasswordError.UNKNOWN;
    }
};
exports.logInWithUsernameAndPassword = logInWithUsernameAndPassword;
