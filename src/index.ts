import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { allRoutes } from "./routes/routes";

const app = new Hono();


serve(allRoutes, ({ port }) => {
  console.log(`\t Running @ http://localhost:${port}`);
});