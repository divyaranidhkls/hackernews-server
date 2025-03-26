import type { User } from "@prisma/client";

export type SignUpWithUsernameAndPasswordResult = {
  token: string;
  user: User;
};

export enum SignUpWithUsernameAndPasswordError {
  CONFLICTING_USERNAME = "CONFLICTING_USERNAME",
  UNKNOWN = "UNKNOWN",
}
