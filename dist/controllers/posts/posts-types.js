"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDeletepostsError = exports.getPostsError = void 0;
var getPostsError;
(function (getPostsError) {
    getPostsError[getPostsError["BAD_REQUEST"] = 0] = "BAD_REQUEST";
    getPostsError[getPostsError["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
})(getPostsError || (exports.getPostsError = getPostsError = {}));
var getDeletepostsError;
(function (getDeletepostsError) {
    getDeletepostsError[getDeletepostsError["NOT_FOUND"] = 0] = "NOT_FOUND";
    getDeletepostsError[getDeletepostsError["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
})(getDeletepostsError || (exports.getDeletepostsError = getDeletepostsError = {}));
