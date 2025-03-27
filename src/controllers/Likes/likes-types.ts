import type { Like } from "@prisma/client";

export type LikePost = {
  Likes : Like
};
export enum LikeErrors {
  NOT_FOUND,
  UNAUTHORIZED,
  ALREADY_LIKED,
}
