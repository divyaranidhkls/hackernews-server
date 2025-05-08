// import { getmeError, GetUserError, type getmeResult, type userResult } from "./users-types";
// import { prismaClient } from "../../extra/prisma";

// export const getMe = async (parameters: { userId: string }): Promise<getmeResult> => {
//   const user = await prismaClient.user.findUnique({
//     where: { id: parameters.userId },
//   });

//   if (!user) {
//     throw getmeError.BAD_REQUEST;
//   }

//   return {user};
// };

// export const getAllUsers = async (page: number = 1, limit: number = 10): Promise<userResult> => {
//   const users = await prismaClient.user.findMany({
//     orderBy: { username: "asc" },
//     skip: (page - 1) * limit,
//     take: limit,
//   });

//   const totalusers = await prismaClient.user.count();

 

//   return {

//     users: usersWithDisplayUsername,
//     total: totalusers,
  
//   };
// };
