"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostsById = exports.getPostsBymeInOrder = exports.getPostsChronologicalOrder = exports.createPosts = void 0;
const prisma_js_1 = require("../../extra/prisma.js");
const posts_types_js_1 = require("./posts-types.js");
//POST /posts -- Creates a post (authored by the current user).
const createPosts = async (parameters) => {
    const { userId, input } = parameters;
    if (!input.title || !input.content) {
        throw posts_types_js_1.getPostsError.BAD_REQUEST;
    }
    const newPost = await prisma_js_1.prismaClient.post.create({
        data: {
            userId: userId,
            content: input.content,
            title: input.title,
        },
    });
    return { post: newPost };
};
exports.createPosts = createPosts;
//GET /posts -- Returns all posts in reverse chronological order (paginated).
const getPostsChronologicalOrder = async (page = 1, limit = 10) => {
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    if (!Number.isInteger(pageNumber) || pageNumber <= 0 || !Number.isInteger(limitNumber) || limitNumber <= 0) {
        throw posts_types_js_1.getPostsError.BAD_REQUEST; // or custom error saying invalid page/limit
    }
    const Results = await prisma_js_1.prismaClient.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        // Remove the wrong `include`
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
    });
    const total = await prisma_js_1.prismaClient.post.count();
    return { post: Results, total };
};
exports.getPostsChronologicalOrder = getPostsChronologicalOrder;
const getPostsBymeInOrder = async (parameters) => {
    const Results = await prisma_js_1.prismaClient.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        where: {
            userId: parameters.userId,
        },
        include: {
            posts: true,
        },
        skip: (parameters.page - 1) * parameters.limit,
        take: parameters.limit,
    });
    const total = await prisma_js_1.prismaClient.post.count();
    if (!Results) {
        throw posts_types_js_1.getPostsError.BAD_REQUEST;
    }
    return { post: Results, total: total };
};
exports.getPostsBymeInOrder = getPostsBymeInOrder;
const deletePostsById = async (Parameters) => {
    const { userId, postId } = Parameters;
    const user = await prisma_js_1.prismaClient.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw posts_types_js_1.getDeletepostsError.NOT_FOUND;
    }
    else {
        const posts = await prisma_js_1.prismaClient.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (posts) {
            await prisma_js_1.prismaClient.post.delete({
                where: {
                    id: postId,
                },
            });
            return "Posts Deleted";
        }
        throw posts_types_js_1.getDeletepostsError.UNAUTHORIZED;
    }
};
exports.deletePostsById = deletePostsById;
