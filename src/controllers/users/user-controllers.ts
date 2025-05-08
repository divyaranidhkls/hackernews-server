import { getmeError, GetUserError, type getmeResult, type userResult } from "./users-types";
import { prismaClient } from "../../extra/prisma.js";

export const getMe = async (parameters: { userId: string })=> {
  const users = await prismaClient.user.findUnique({
    where: { id: parameters.userId },
  });

  if (!users) {
    throw getmeError.BAD_REQUEST;
  }
  return {
    user: users,
  };

};

export const getAllUsers = async (page: number = 1, limit: number = 10): Promise<userResult> => {
  const users1 = await prismaClient.user.findMany({
    orderBy: { username: "asc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  const totalusers = await prismaClient.user.count();

 
  if (!users1) {
    throw GetUserError.BAD_REQUEST;
  }
  

  
  return {
    user : users1,
    total: totalusers,
  };
};
