import { getmeError, type getmeResult } from "./users-types.js";
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
export const getAllUsers = async (parameters: {}): Promise<{ user: { id: string; name: string | null; username: string; email: string; password: string; createdAt: Date; updatedAt: Date; }[] }>=>{
  const users = await prismaClient.user.findMany();
  if (!users) {
    throw getmeError.BAD_REQUEST;
  }
  return {
    user: users,
  };
};
