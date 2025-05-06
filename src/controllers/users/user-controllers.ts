import { getmeError, GetUserError, type getmeResult } from "./users-types";
import { type userResult } from "./users-types";
import { prismaClient } from "../../extra/prisma";

export const getMe = async (parameters: {
  userId: string;
}): Promise<getmeResult> => {
  const user = await prismaClient.user.findUnique({
    where: {
      id: parameters.userId,
    },
  });

  if (!user) {
    throw getmeError.BAD_REQUEST;
  }

  return {
    user: {
      ...user,
      displayUsername: user.username.toUpperCase(), // Example logic for displayUsername
    },
  };
};
export const getAllUsers = async (
  page: number = 1,
  limit: number = 10
): Promise<userResult> => {
  const users = await prismaClient.user.findMany({
    orderBy: {
      username: "asc",
    },
    skip: (page - 1) * limit,
    take: limit,
  });
  const totalusers = Number(await prismaClient.user.count());
  if (!users) {
    throw GetUserError.BAD_REQUEST;
  }
  const usersWithDisplayUsername = users.map(user => ({
    ...user,
    displayUsername: user.username.toUpperCase(), // Example logic for displayUsername
  }));
  return {
    user: usersWithDisplayUsername,
    total: totalusers,
  };
};
