import { createHash } from "crypto";
import {
  SignUpWithUsernameAndPasswordError,
  type SignUpWithUsernameAndPasswordResult,
} from "./authentication-types.js";
import jwt from "jsonwebtoken";
import { prismaClient } from "../../extra/prisma.js";
import { jwtSecretKey } from "../../environment.js";
const createJWToken = (parameters: {
  id: string;
  username: string;
}): string => {
  // Generate token
  const jwtPayload: jwt.JwtPayload = {
    iss: "https://purpleshorts.co.in",
    sub: parameters.id,
    username: parameters.username,
  };

  const token = jwt.sign(jwtPayload, jwtSecretKey, {
    expiresIn: "30d",
  });

  return token;
};

export const checIfUserExistsAlready = async (parameters: {
  username: string;
}): Promise<boolean> => {
  const ExistingUser = await prismaClient.user.findUnique({
    where: {
      username: parameters.username,
    },
  });
  if (ExistingUser) {
    return true;
  }
  return false;
};

export const signUpWithUsernameAndPassword = async (parameters: {
  username: string;
  password: string;
  email: string;
}): Promise<SignUpWithUsernameAndPasswordResult> => {
  try {
    const isUserExistingAlready = await checIfUserExistsAlready({
      username: parameters.username,
    });

    if (isUserExistingAlready) {
      throw SignUpWithUsernameAndPasswordError.CONFLICTING_USERNAME;
    }

    const passwordHash = createHash("sha256")
      .update(parameters.password)
      .digest("hex");

    const user = await prismaClient.user.create({
      data: {
        username: parameters.username,
        password: passwordHash,
        email: parameters.email,
      },
    });
    const token = createJWToken({
      id: user.id,
      username: user.username,
    });

    const result: SignUpWithUsernameAndPasswordResult = {
      token,
      user,
    };

    return result;
  } catch (e) {
    throw SignUpWithUsernameAndPasswordError.UNKNOWN;
  }
};
