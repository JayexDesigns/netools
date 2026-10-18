# syntax=docker/dockerfile:1

# --- Build stage: compile the app into static assets ---
FROM node:24-alpine AS build

WORKDIR /app

RUN npm install --global pnpm@12

# Fetch the dependencies from the lockfile alone, so this layer is only rebuilt when the lockfile changes
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch

COPY . .
RUN pnpm install --frozen-lockfile --offline

# tsc -b type-checks the app, the configs and the tests, then vite emits the production bundle into dist/
RUN pnpm run build

# --- Runtime stage: serve the static bundle with nginx ---
FROM nginx:alpine AS runtime

LABEL org.opencontainers.image.title="netools"

# SPA fallback and caching rules, the router handles every path on the client
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
