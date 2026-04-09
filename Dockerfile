# Root Dockerfile for Monorepo
# Uses build-arg SERVICE_NAME to pick what to build/run (default: backend)

FROM node:20-alpine AS builder
ARG SERVICE_NAME=backend
WORKDIR /app

# Copy lockfiles and manifests
COPY package.json package-lock.json* ./
COPY backend/package.json backend/package-lock.json* ./backend/
COPY frontend/package.json frontend/package-lock.json* ./frontend/

# Install everything
RUN npm install

# Copy source
COPY . .

# IMPORTANT: Generate Prisma Client for TypeScript to recognize the models
RUN cd backend && npx prisma generate

# Build based on SERVICE_NAME
RUN if [ "$SERVICE_NAME" = "frontend" ]; then \
      npm run build:frontend; \
    else \
      npm run build:backend; \
    \
    fi

# Production stage for Backend
FROM node:20-alpine AS runner-backend
WORKDIR /app
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/prisma ./backend/prisma
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
CMD ["sh", "-c", "cd backend && npx prisma db push --accept-data-loss && node dist/main"]

# Production stage for Frontend (Nginx)
FROM nginx:alpine AS runner-frontend
COPY --from=builder /app/frontend/dist /usr/share/nginx/html
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Final stage selector
# Note: Railway builds the last stage by default, but we can use TARGET or just specific Dockerfiles.
# To make it "compile for sure" at root, we will default to Backend for the final stage.
FROM runner-backend
