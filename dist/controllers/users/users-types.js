"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserError = exports.getmeError = void 0;
var getmeError;
(function (getmeError) {
    getmeError["BAD_REQUEST"] = "BAD_REQUEST";
    getmeError["UNAUTHORIZED"] = "UNAUTHORIZED";
})(getmeError || (exports.getmeError = getmeError = {}));
var GetUserError;
(function (GetUserError) {
    GetUserError[GetUserError["BAD_REQUEST"] = 0] = "BAD_REQUEST";
})(GetUserError || (exports.GetUserError = GetUserError = {}));
