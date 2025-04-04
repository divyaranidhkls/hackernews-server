import { prismaClient } from "../../extra/prisma.js";
import { getDeletepostsError, getPostsError, } from "./posts-types.js";
//POST /posts -- Creates a post (authored by the current user).
export const createPosts = async (parameters) => {
    const { userId, input } = parameters;
    if (!input.title || !input.content) {
        throw getPostsError.BAD_REQUEST;
    }
    const newPost = await prismaClient.post.create({
        data: {
            userId: userId,
            content: input.content,
            title: input.title,
        },
    });
    return { post: newPost };
};
//GET /posts -- Returns all posts in reverse chronological order (paginated).
export const getPostsCronologicalOrder = async (page = 1, limit = 1) => {
    const Results = await prismaClient.post.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            posts: true,
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    const total = await prismaClient.post.count();
    if (!Results) {
        throw getPostsError.BAD_REQUEST;
    }
    return { post: Results, total: total };
};
export const getPostsBymeInOrder = async (parameters) => {
    const Results = await prismaClient.post.findMany({
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
    const total = await prismaClient.post.count();
    if (!Results) {
        throw getPostsError.BAD_REQUEST;
    }
    return { post: Results, total: total };
};
export const deletePostsById = async (Parameters) => {
    const { userId, postId } = Parameters;
    const user = await prismaClient.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw getDeletepostsError.NOT_FOUND;
    }
    else {
        const posts = await prismaClient.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (posts) {
            await prismaClient.post.delete({
                where: {
                    id: postId,
                },
            });
            return "Posts Deleted";
        }
        throw getDeletepostsError.UNAUTHORIZED;
    }
};
