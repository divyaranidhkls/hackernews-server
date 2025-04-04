import { createHash } from "crypto";
import { SignUpWithUsernameAndPasswordError, } from "./authentication-types.js";
import { LogInWtihUsernameAndPasswordError, } from "./authentication-types.js";
import jwt from "jsonwebtoken";
import { prismaClient } from "../../extra/prisma.js";
import { jwtSecretKey } from "../../environment.js";
const createJWToken = (parameters) => {
    // Generate token
    const jwtPayload = {
        iss: "https://purpleshorts.co.in",
        sub: parameters.id,
        username: parameters.username,
    };
    const token = jwt.sign(jwtPayload, jwtSecretKey, {
        expiresIn: "30d",
    });
    return token;
};
export const checIfUserExistsAlready = async (parameters) => {
    const ExistingUser = await prismaClient.user.findUnique({
        where: {
            username: parameters.username,
        },
    });
    if (ExistingUser) {
        return true;
    }
    return false;
};
export const signUpWithUsernameAndPassword = async (parameters) => {
    try {
        const isUserExistingAlready = await checIfUserExistsAlready({
            username: parameters.username,
        });
        if (isUserExistingAlready) {
            throw SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
        }
        const passwordHash = createHash("sha256")
            .update(parameters.password)
            .digest("hex");
        const user = await prismaClient.user.create({
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
        throw SignUpWithUsernameAndPasswordError.UNKNOWN;
    }
};
export const logInWithUsernameAndPassword = async (parameters) => {
    try {
        const passwordHash = createHash("sha256")
            .update(parameters.password)
            .digest("hex");
        const user = await prismaClient.user.findUnique({
            where: {
                username: parameters.username,
                password: passwordHash,
            },
        });
        if (!user) {
            throw LogInWtihUsernameAndPasswordError.INCORRECT_USERNAME_OR_PASSWORD;
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
        throw LogInWtihUsernameAndPasswordError.UNKNOWN;
    }
};
