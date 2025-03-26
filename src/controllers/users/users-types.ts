import type { User } from "@prisma/client";

export type getmeResult = {
  user: User;
};

export enum getmeError {
  BAD_REQUEST = "BAD_REQUEST",
  UNAUTHORIZED = "UNAUTHORIZED",
}
export type userResult = {
  user: Array<User>;
};
export enum GetUserError {
  BAD_REQUEST,
}
