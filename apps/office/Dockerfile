FROM node:22-alpine AS base

WORKDIR /usr/src/app

FROM base AS builder

COPY package*.json tsconfig*.json nest-cli.json . 
COPY apps/office ./apps/office

RUN npm ci
RUN npm run build:office


FROM base AS runner

EXPOSE 4000

ENV PORT=4000
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
RUN chown nestjs:nodejs .
USER nestjs

COPY --from=builder --chown=nestjs:nodejs /usr/src/app/package*.json .
RUN npm ci --omit=dev

COPY --from=builder --chown=nestjs:nodejs /usr/src/app/dist/apps/office ./dist

ENTRYPOINT [ "node", "dist/main.js" ]
