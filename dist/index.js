"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const routes_1 = require("./routes/routes");
const app = new hono_1.Hono();
(0, node_server_1.serve)(routes_1.allRoutes, ({ port }) => {
    console.log(`\t Running @ http://localhost:${port}`);
});
