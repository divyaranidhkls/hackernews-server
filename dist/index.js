import { serve } from "@hono/node-server";
import { allRoutes } from "./routes/routes.js";
allRoutes.get("/health", (c) => {
    return c.text("Hello Hono!");
});
serve({
    fetch: allRoutes.fetch,
    port: 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});
