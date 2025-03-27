import type { Comment } from "@prisma/client";
import type { CommonExecOptions } from "child_process";

export type getcommentResult = {
  comment: Comment;
};

export enum getcommentError {
  UNAUTHORIZED,
  NOT_FOUND,
}
