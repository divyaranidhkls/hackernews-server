"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getcommentError = void 0;
var getcommentError;
(function (getcommentError) {
    getcommentError[getcommentError["UNAUTHORIZED"] = 0] = "UNAUTHORIZED";
    getcommentError[getcommentError["NOT_FOUND"] = 1] = "NOT_FOUND";
    getcommentError[getcommentError["BAD_REQUEST"] = 2] = "BAD_REQUEST";
})(getcommentError || (exports.getcommentError = getcommentError = {}));
