import { prismaClient } from "../../../extra/prisma.js";
import { getcommentError, } from "../Comments/comments-types.js";
export const CommentPosts = async (parameters) => {
    const { userId, postId, content } = parameters;
    const userExists = await prismaClient.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!userExists) {
        throw getcommentError.NOT_FOUND;
    }
    const postExists = await prismaClient.post.findUnique({
        where: {
            id: postId,
        },
    });
    if (!postExists) {
        throw getcommentError.NOT_FOUND;
    }
    const Result = await prismaClient.comment.create({
        data: {
            userId: userId,
            postId: postId,
            content: content,
        },
    });
    return { comment: Result };
};
export const getComments = async (parameters) => {
    const { page, limit } = parameters;
    const Results = await prismaClient.comment.findMany({
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    const total = await prismaClient.comment.count();
    if (!Results) {
        throw getcommentError.UNAUTHORIZED;
    }
    return { comments: Results, total: total };
};
export const deteleComments = async (parameters) => {
    const { userId, commentsId } = parameters;
    const users = await prismaClient.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!users) {
        throw getcommentError.UNAUTHORIZED;
    }
    const comments = await prismaClient.comment.findUnique({
        where: {
            id: commentsId,
        },
    });
    if (!comments) {
        throw getcommentError.NOT_FOUND;
    }
    await prismaClient.comment.delete({
        where: {
            id: commentsId,
        },
    });
    return "Comments Deleted Successfully";
};
export const UpdateComments = async (parameters) => {
    const { userId, commentsId, content } = parameters;
    const users = await prismaClient.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!users) {
        throw getcommentError.UNAUTHORIZED;
    }
    const comments = await prismaClient.comment.findUnique({
        where: {
            id: commentsId,
        },
    });
    if (!comments) {
        throw getcommentError.NOT_FOUND;
    }
    const newComment = await prismaClient.comment.update({
        where: {
            id: commentsId,
        },
        data: {
            content: content,
        },
    });
    return { newComment };
};
