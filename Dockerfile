# docker build -t docker.frappet.com/edm/core .
FROM node:23-slim AS base

ENV NPM_HOME="/npm"
ENV PATH="$NPM_HOME:$PATH"

RUN apt-get update && apt-get install -y git && rm -rf /var/lib/apt/lists/*
RUN corepack enable

ARG API_ENDPOINT="/api/v1"

WORKDIR /app

FROM base AS api
WORKDIR /api
COPY ./api .

FROM api AS deps
RUN --mount=type=cache,id=npm,target=/npm/store npm install --prod --frozen-lockfile --legacy-peer-deps

FROM api AS build
RUN --mount=type=cache,id=npm,target=/npm/store npm install --frozen-lockfile --legacy-peer-deps
RUN npx prisma generate
RUN npm run build

FROM base AS web-app
WORKDIR /app
COPY ./web-app .
ENV VITE_API_ENDPOINT="${API_ENDPOINT}"

RUN --mount=type=cache,id=npm,target=/npm/store npm install --frozen-lockfile --legacy-peer-deps
RUN npm run generate

FROM base AS web-manage
WORKDIR /admin
COPY ./web-manage .
ENV VITE_API_ENDPOINT="${API_ENDPOINT}"

RUN --mount=type=cache,id=npm,target=/npm/store npm install --frozen-lockfile --legacy-peer-deps
RUN npm run generate

FROM base AS prod
WORKDIR /app
# Copy the built application and all node_modules from build stage
COPY --from=build /api/dist ./dist
COPY --from=build /api/node_modules ./node_modules
COPY --from=api /api/prisma ./prisma
COPY --from=api /api/package.json ./package.json

COPY --from=web-app /app/.output/public ./static
COPY --from=web-manage /admin/.output/public ./admin

COPY ./entrypoint.sh ./entrypoint.sh

RUN chmod u+x ./entrypoint.sh

EXPOSE 4056

ENTRYPOINT ["./entrypoint.sh"]
