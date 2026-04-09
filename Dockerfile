# This root Dockerfile is a fallback to ensure Railway detection works
# It defaults to building the Backend.

FROM node:20-alpine AS builder

WORKDIR /app

# Copy root config
COPY package.json package-lock.json* ./

# Copy backend and frontend
COPY backend/package.json backend/package-lock.json* ./backend/
COPY frontend/package.json frontend/package-lock.json* ./frontend/

# Install all dependencies
RUN npm install

# Copy source code
COPY . .

# Build backend (default)
RUN npm run build:backend

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/prisma ./backend/prisma

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Command to run backend
CMD ["sh", "-c", "cd backend && npx prisma db push --force && node dist/main"]
