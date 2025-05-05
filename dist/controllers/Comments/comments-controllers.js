"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllComments = exports.UpdateComments = exports.deteleComments = exports.getComments = exports.CommentPosts = void 0;
const prisma_1 = require("../../extra/prisma");
const comments_types_1 = require("../Comments/comments-types");
const CommentPosts = async (parameters) => {
    const { userId, postId, content } = parameters;
    // const userExists = await prismaClient.user.findUnique({
    //   where: {
    //     id: userId,
    //   },
    // });
    // if (!userExists) {
    //   throw getcommentError.NOT_FOUND;
    // }
    // const postExists = await prismaClient.post.findUnique({
    //   where: {
    //     id: postId,
    //   },
    // });
    // if (!postExists) {
    //   throw getcommentError.NOT_FOUND;
    // }
    const Result = await prisma_1.prismaClient.comment.create({
        data: {
            userId: userId,
            postId: postId,
            content: content,
            // Removed as it's not part of the expected type
        },
    });
    return { comment: Result };
};
exports.CommentPosts = CommentPosts;
const getComments = async (parameters) => {
    const { page, limit, postId } = parameters;
    try {
        const Results = await prisma_1.prismaClient.comment.findMany({
            where: {
                postId: postId, // Add a condition to filter by postId
            },
            orderBy: {
                createdAt: "desc", // Sort by creation date in descending order
            },
            skip: (page - 1) * limit, // Pagination: Skip based on the page and limit
            take: limit, // Limit the number of results
        });
        const total = await prisma_1.prismaClient.comment.count({
            where: {
                postId: postId, // Count only comments for the specific postId
            },
        });
        return { comments: Results, total: total };
    }
    catch (error) {
        console.error("Error fetching comments:", error);
        throw new Error("Failed to fetch comments");
    }
};
exports.getComments = getComments;
const deteleComments = async (parameters) => {
    const { userId, commentsId } = parameters;
    const users = await prisma_1.prismaClient.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!users) {
        throw comments_types_1.getcommentError.UNAUTHORIZED;
    }
    const comments = await prisma_1.prismaClient.comment.findUnique({
        where: {
            id: commentsId,
        },
    });
    if (!comments) {
        throw comments_types_1.getcommentError.NOT_FOUND;
    }
    await prisma_1.prismaClient.comment.delete({
        where: {
            id: commentsId,
        },
    });
    return "Comments Deleted Successfully";
};
exports.deteleComments = deteleComments;
const UpdateComments = async (parameters) => {
    const { userId, commentsId, content } = parameters;
    const users = await prisma_1.prismaClient.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!users) {
        throw comments_types_1.getcommentError.UNAUTHORIZED;
    }
    const comments = await prisma_1.prismaClient.comment.findUnique({
        where: {
            id: commentsId,
        },
    });
    if (!comments) {
        throw comments_types_1.getcommentError.NOT_FOUND;
    }
    const newComment = await prisma_1.prismaClient.comment.update({
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
const getAllComments = async (parameters) => {
    const { userId, page, limit } = parameters;
    const comments = await prisma_1.prismaClient.comment.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    const total = await prisma_1.prismaClient.comment.count({
        where: {
            userId: userId,
        },
    });
    return { comments, total };
};
exports.getAllComments = getAllComments;
