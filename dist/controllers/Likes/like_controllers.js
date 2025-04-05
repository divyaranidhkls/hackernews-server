"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLikeById = exports.getLikes = exports.LikePosts = void 0;
const likes_types_js_1 = require("./likes-types.js");
const prisma_js_1 = require("../../extra/prisma.js");
const likes_types_js_2 = require("../Likes/likes-types.js");
const LikePosts = async (parameters) => {
    const { userId, postId } = parameters;
    const userExists = await prisma_js_1.prismaClient.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!userExists) {
        throw likes_types_js_1.LikeErrors.NOT_FOUND;
    }
    const postExists = await prisma_js_1.prismaClient.post.findUnique({
        where: {
            id: postId,
        },
    });
    if (!postExists) {
        throw likes_types_js_1.LikeErrors.NOT_FOUND;
    }
    const LikeExists = await prisma_js_1.prismaClient.like.findFirst({
        where: {
            userId,
            postId,
        },
    });
    if (LikeExists) {
        throw likes_types_js_1.LikeErrors.ALREADY_LIKED;
    }
    const Result = await prisma_js_1.prismaClient.like.create({
        data: {
            userId,
            postId,
        },
    });
    return { Likes: Result };
};
exports.LikePosts = LikePosts;
const getLikes = async (parameters) => {
    const { page, limit } = parameters;
    const Results = await prisma_js_1.prismaClient.like.findMany({
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });
    const total = await prisma_js_1.prismaClient.like.count();
    if (!Results) {
        throw likes_types_js_1.LikeErrors.UNAUTHORIZED;
    }
    return { Like: Results, total: total };
};
exports.getLikes = getLikes;
const deleteLikeById = async (Parameters) => {
    const { userId, postId } = Parameters;
    const user = await prisma_js_1.prismaClient.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw likes_types_js_2.DeleteLikeErrors.NOT_FOUND;
    }
    else {
        const posts = await prisma_js_1.prismaClient.post.findUnique({
            where: {
                id: postId,
            },
        });
        if (posts) {
            const LikeExists = await prisma_js_1.prismaClient.like.findFirst({
                where: {
                    userId,
                    postId,
                },
            });
            if (LikeExists) {
                await prisma_js_1.prismaClient.like.delete({
                    where: {
                        id: LikeExists.id,
                    },
                });
                return "Like Deleted SucceFully";
            }
        }
        throw likes_types_js_2.DeleteLikeErrors.NOT_FOUND;
    }
};
exports.deleteLikeById = deleteLikeById;
