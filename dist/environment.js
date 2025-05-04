"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.betterAuthSecret = exports.webClientUrl = exports.serverUrl = exports.jwtSecretKey = void 0;
exports.jwtSecretKey = process.env.JWT_SECRETE_KEY || process.exit(1);
exports.serverUrl = process.env.SERVER_URL || process.exit(1);
exports.webClientUrl = process.env.WEB_CLIENT_URL || process.exit(1);
exports.betterAuthSecret = process.env.BETTER_AUTH_SECRET || process.exit(1);
