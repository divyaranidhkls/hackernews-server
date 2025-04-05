import { serve } from '@hono/node-server';
import { allRoutes } from './routes/routes';

serve({
  fetch: allRoutes.fetch,
  port: parseInt(process.env.PORT || "3000", 10),
}, (info) => {
  console.log(`Server is running @ http://localhost:${info.port}`);
});