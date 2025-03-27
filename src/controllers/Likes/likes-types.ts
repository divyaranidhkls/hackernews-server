import type { Like } from "@prisma/client";

export type LikePost = {
  Likes: Like;
};
export enum LikeErrors {
  NOT_FOUND,
  UNAUTHORIZED,
  ALREADY_LIKED,
}

export type getAllLikes = {
  Like: Array<Like>;
  total: number;
};
export enum DeleteLikeErrors {
  NOT_FOUND,
  UNAUTHORIZED,
}
