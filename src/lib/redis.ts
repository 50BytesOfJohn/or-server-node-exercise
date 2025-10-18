import { createClient } from "redis";
import { env } from "../env.js";
import { logger } from "./logger.js";

export const redis = await createClient({
  url: env.REDIS_URL,
})
  .on("error", (err) =>
    logger.error({
      rawError: err,
    })
  )
  .connect();
