FROM node:20-alpine AS deps
WORKDIR /app/server

COPY server/package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app/server
ENV NODE_ENV=production

COPY --from=deps /app/server/node_modules ./node_modules
COPY server ./

EXPOSE 8000
CMD ["node", "src/index.js"]
