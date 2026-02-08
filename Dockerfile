FROM node:20-alpine AS frontend-builder
WORKDIR /app/web
COPY web/package*.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

FROM node:20-alpine AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY server ./server
COPY --from=frontend-builder /app/web/build ./server/public

WORKDIR /app/server
EXPOSE 8000
CMD ["node", "src/index.js"]
