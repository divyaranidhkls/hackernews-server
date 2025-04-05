"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostsById = exports.getPostsBymeInOrder = exports.getPostsCronologicalOrder = exports.createPosts = void 0;
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
const getPostsCronologicalOrder = async (page = 1, limit = 1) => {
    const Results = await prisma_js_1.prismaClient.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            posts: true,
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    const total = await prisma_js_1.prismaClient.post.count();
    if (!Results) {
        throw posts_types_js_1.getPostsError.BAD_REQUEST;
    }
    return { post: Results, total: total };
};
exports.getPostsCronologicalOrder = getPostsCronologicalOrder;
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
