"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteLikeErrors = exports.LikeErrors = void 0;
var LikeErrors;
(function (LikeErrors) {
    LikeErrors[LikeErrors["NOT_FOUND"] = 0] = "NOT_FOUND";
    LikeErrors[LikeErrors["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
    LikeErrors[LikeErrors["ALREADY_LIKED"] = 2] = "ALREADY_LIKED";
})(LikeErrors || (exports.LikeErrors = LikeErrors = {}));
var DeleteLikeErrors;
(function (DeleteLikeErrors) {
    DeleteLikeErrors[DeleteLikeErrors["NOT_FOUND"] = 0] = "NOT_FOUND";
    DeleteLikeErrors[DeleteLikeErrors["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
})(DeleteLikeErrors || (exports.DeleteLikeErrors = DeleteLikeErrors = {}));
