import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z
    .string()
    .default("3000")
    .transform((val) => parseInt(val, 10))
    .refine((port) => port > 0 && port < 65536, {
      message: "PORT must be between 1 and 65535",
    }),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string(),
});
console.log(process.env.DATABASE_URL);
export const env = envSchema.parse(process.env);

export type EnvVariables = z.infer<typeof envSchema>;
