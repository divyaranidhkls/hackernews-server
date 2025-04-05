import { serve } from '@hono/node-server';
import { allRoutes } from './routes/routes';

const port = parseInt(process.env.PORT || "3000", 10); // ✅ Use process.env.PORT

allRoutes.get("/info", (context) => {
  return context.json({ message: "Hello World from Azure!" });
});

serve({ fetch: allRoutes.fetch, port }, (info) => {
  console.log(`✅ Server is running at http://localhost:${info.port}`);
});
