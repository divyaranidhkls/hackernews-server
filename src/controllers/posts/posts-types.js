export var getPostsError;
(function (getPostsError) {
    getPostsError[getPostsError["BAD_REQUEST"] = 0] = "BAD_REQUEST";
    getPostsError[getPostsError["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
})(getPostsError || (getPostsError = {}));
export var getDeletepostsError;
(function (getDeletepostsError) {
    getDeletepostsError[getDeletepostsError["NOT_FOUND"] = 0] = "NOT_FOUND";
    getDeletepostsError[getDeletepostsError["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
})(getDeletepostsError || (getDeletepostsError = {}));
