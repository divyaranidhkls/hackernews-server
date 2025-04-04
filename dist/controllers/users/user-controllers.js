import { getmeError, GetUserError } from "./users-types.js";
import { prismaClient } from "../../extra/prisma.js";
export const getMe = async (parameters) => {
    const user = await prismaClient.user.findUnique({
        where: {
            id: parameters.userId,
        },
    });
    if (!user) {
        throw getmeError.BAD_REQUEST;
    }
    return {
        user,
    };
};
export const getAllUsers = async (page = 1, limit = 10) => {
    const users = await prismaClient.user.findMany({
        orderBy: {
            username: "asc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    const totalusers = Number(prismaClient.user.count());
    if (!users) {
        throw GetUserError.BAD_REQUEST;
    }
    return {
        user: users,
        total: totalusers,
    };
};
