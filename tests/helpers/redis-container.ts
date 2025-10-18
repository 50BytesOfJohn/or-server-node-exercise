import { RedisContainer } from "@testcontainers/redis";

export async function startRedis() {
  const container = await new RedisContainer("redis:latest").start();
  const url = container.getConnectionUrl();

  return { container, url };
}
