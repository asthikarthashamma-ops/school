# Stage 1: Build React Client
FROM node:24-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Stage 2: Setup Express Backend
FROM node:24-alpine
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install --only=production
COPY server/ ./

# Copy compiled React bundle to relative path for Express hosting
COPY --from=client-builder /app/client/dist /app/client/dist

EXPOSE 5000
ENV NODE_ENV=production
CMD ["node", "src/server.js"]
