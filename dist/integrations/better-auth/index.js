"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const better_auth_1 = require("better-auth");
const environment_1 = require("../../environment");
const prisma_1 = require("better-auth/adapters/prisma");
const prisma_2 = require("../prisma");
const plugins_1 = require("better-auth/plugins");
const betterAuthServerClient = (0, better_auth_1.betterAuth)({
    baseURL: environment_1.serverUrl,
    trustedOrigins: [environment_1.webClientUrl],
    secret: environment_1.betterAuthSecret,
    plugins: [(0, plugins_1.username)()],
    database: (0, prisma_1.prismaAdapter)(prisma_2.prismaClient, {
        provider: "postgresql",
    }),
    user: {
        modelName: "User",
    },
    session: {
        modelName: "Session",
    },
    account: {
        modelName: "Account",
    },
    verification: {
        modelName: "Verification",
    },
    emailAndPassword: {
        enabled: true,
    },
});
exports.default = betterAuthServerClient;
