"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getMe = void 0;
const users_types_1 = require("./users-types");
const prisma_1 = require("../../extra/prisma");
const getMe = async (parameters) => {
    const user = await prisma_1.prismaClient.user.findUnique({
        where: {
            id: parameters.userId,
        },
    });
    if (!user) {
        throw users_types_1.getmeError.BAD_REQUEST;
    }
    return {
        user,
    };
};
exports.getMe = getMe;
const getAllUsers = async (page = 1, limit = 10) => {
    const users = await prisma_1.prismaClient.user.findMany({
        orderBy: {
            username: "asc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    const totalusers = Number(prisma_1.prismaClient.user.count());
    if (!users) {
        throw users_types_1.GetUserError.BAD_REQUEST;
    }
    return {
        user: users,
        total: totalusers,
    };
};
exports.getAllUsers = getAllUsers;
