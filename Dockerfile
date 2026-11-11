# Production-style image for the ATM simulator.
# Used by `docker compose --profile app up -d --build`; local development uses `npm run dev`.

FROM node:26-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 \
    PRISMA_HIDE_UPDATE_MESSAGE=1

# Install dependencies. `postinstall` runs `prisma generate`, which needs the schema and config.
FROM base AS deps
COPY package.json package-lock.json prisma.config.ts ./
COPY prisma ./prisma
COPY lib/env.ts ./lib/env.ts
RUN npm ci

# Build the Next.js app. Pages that read the database render at request time,
# so the build does not need a running database.
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate && npm run build

# Runtime keeps the Prisma CLI and tsx so the container can migrate and seed on start.
FROM base AS runner
ENV NODE_ENV=production
COPY --from=build --chown=node:node /app ./
USER node
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start"]
