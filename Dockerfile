# --- Etapa 1: Build Frontend ---
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

# --- Etapa 2: Build Backend ---
FROM node:20-alpine AS build-backend
WORKDIR /app/backend
COPY backend/package.json backend/package-lock.json* ./
COPY backend/prisma ./prisma/
RUN npm install
# Generar cliente de Prisma
RUN npx prisma generate
COPY backend/ .
RUN npm run build

# --- Etapa 3: Imagen Final (Monolito) ---
FROM node:20-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copiar Backend compilado
COPY --from=build-backend /app/backend/dist ./dist
COPY --from=build-backend /app/backend/node_modules ./node_modules
COPY --from=build-backend /app/backend/package.json ./package.json
COPY --from=build-backend /app/backend/prisma ./prisma

# Copiar Frontend compilado a la carpeta 'client' que servirá el Backend
COPY --from=build-frontend /app/frontend/dist ./client

EXPOSE 3000

# Sincronizar BD e iniciar servidor
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/main"]
