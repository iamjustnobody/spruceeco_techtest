# Stage 1: Build TypeScript
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run built JS
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Optional volume for SQLite
VOLUME ["/app/data"]

EXPOSE 4000
CMD ["node", "dist/server.js"]
