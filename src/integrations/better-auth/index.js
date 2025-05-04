"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var better_auth_1 = require("better-auth");
var environment_1 = require("../../utils/environment");
var prisma_1 = require("better-auth/adapters/prisma");
var prisma_2 = require("../prisma");
var betterAuthServerClient = (0, better_auth_1.betterAuth)({
    baseURL: environment_1.serverUrl,
    trustedOrigins: [environment_1.webClientUrl],
    secret: environment_1.betterAuthSecret,
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
