import { getmeError, GetUserError, type getmeResult } from "./users-types.js";
import { type userResult } from "./users-types.js";
import { prismaClient } from "../../extra/prisma.js";

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
    user,
  };
};
export const getAllUsers = async (): Promise<userResult> => {
  const users = await prismaClient.user.findMany();
  if (!users) {
    throw GetUserError.BAD_REQUEST;
  }
  return {
    user: users,
  };
};
