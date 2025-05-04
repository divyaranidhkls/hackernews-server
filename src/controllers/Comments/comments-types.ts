import type { Comment } from "@prisma/client";


export type getcommentResult = {
  comment: Comment;
};

export enum getcommentError {
  UNAUTHORIZED,
  NOT_FOUND,
  BAD_REQUEST,
}


export type getCommentByOrder ={
  comments : Array<Comment>;
  total : number;
}