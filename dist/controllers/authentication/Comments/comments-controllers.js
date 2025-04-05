"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateComments = exports.deteleComments = exports.getComments = exports.CommentPosts = void 0;
const prisma_js_1 = require("../../../extra/prisma.js");
const comments_types_js_1 = require("../Comments/comments-types.js");
const CommentPosts = async (parameters) => {
    const { userId, postId, content } = parameters;
    const userExists = await prisma_js_1.prismaClient.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!userExists) {
        throw comments_types_js_1.getcommentError.NOT_FOUND;
    }
    const postExists = await prisma_js_1.prismaClient.post.findUnique({
        where: {
            id: postId,
        },
    });
    if (!postExists) {
        throw comments_types_js_1.getcommentError.NOT_FOUND;
    }
    const Result = await prisma_js_1.prismaClient.comment.create({
        data: {
            userId: userId,
            postId: postId,
            content: content,
        },
    });
    return { comment: Result };
};
exports.CommentPosts = CommentPosts;
const getComments = async (parameters) => {
    const { page, limit } = parameters;
    const Results = await prisma_js_1.prismaClient.comment.findMany({
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    const total = await prisma_js_1.prismaClient.comment.count();
    if (!Results) {
        throw comments_types_js_1.getcommentError.UNAUTHORIZED;
    }
    return { comments: Results, total: total };
};
exports.getComments = getComments;
const deteleComments = async (parameters) => {
    const { userId, commentsId } = parameters;
    const users = await prisma_js_1.prismaClient.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!users) {
        throw comments_types_js_1.getcommentError.UNAUTHORIZED;
    }
    const comments = await prisma_js_1.prismaClient.comment.findUnique({
        where: {
            id: commentsId,
        },
    });
    if (!comments) {
        throw comments_types_js_1.getcommentError.NOT_FOUND;
    }
    await prisma_js_1.prismaClient.comment.delete({
        where: {
            id: commentsId,
        },
    });
    return "Comments Deleted Successfully";
};
exports.deteleComments = deteleComments;
const UpdateComments = async (parameters) => {
    const { userId, commentsId, content } = parameters;
    const users = await prisma_js_1.prismaClient.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!users) {
        throw comments_types_js_1.getcommentError.UNAUTHORIZED;
    }
    const comments = await prisma_js_1.prismaClient.comment.findUnique({
        where: {
            id: commentsId,
        },
    });
    if (!comments) {
        throw comments_types_js_1.getcommentError.NOT_FOUND;
    }
    const newComment = await prisma_js_1.prismaClient.comment.update({
        where: {
            id: commentsId,
        },
        data: {
            content: content,
        },
    });
    return { newComment };
};
exports.UpdateComments = UpdateComments;
