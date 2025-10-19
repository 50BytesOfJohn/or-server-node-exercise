import { serve } from "@hono/node-server";
import { createApp } from "./app.js";
import { env } from "./env.js";

const app = createApp();

serve(
	{
		fetch: app.fetch,
		port: env.PORT,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
