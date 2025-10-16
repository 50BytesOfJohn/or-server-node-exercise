# syntax=docker/dockerfile:1.7

ARG NODE_VERSION=22-alpine

FROM node:${NODE_VERSION} AS builder

# Install build dependencies
RUN apk add --no-cache gcompat

WORKDIR /app

# Install dependencies with pnpm
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

# Copy source files
COPY tsconfig*.json ./
COPY src ./src

# Build the application
RUN npm run build

# Remove devDependencies for smaller runtime image
RUN pnpm prune --prod

FROM node:${NODE_VERSION} AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 hono

# Copy runtime artifacts
COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

CMD ["node", "/app/dist/index.js"]