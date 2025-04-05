"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const routes_1 = require("./routes/routes");
const port = parseInt(process.env.PORT || "3000", 10); // ✅ Use process.env.PORT
routes_1.allRoutes.get("/info", (context) => {
    return context.json({ message: "Hello World from Azure!" });
});
(0, node_server_1.serve)({ fetch: routes_1.allRoutes.fetch, port }, (info) => {
    console.log(`✅ Server is running at http://localhost:${info.port}`);
});
