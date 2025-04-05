import { serve } from '@hono/node-server'
//import "dotenv/config";
import { allRoutes } from "./routes/routes";


allRoutes.get("/info", (context) => {
  return context.json({
    message: "Hello World",
  });
});

serve(allRoutes, (info) => {
  console.log(`Server is running @ http://localhost:${info.port}`);
});