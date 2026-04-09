# --- Etapa 1: Build ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm ci || npm install

# Generar el cliente de Prisma
RUN npx prisma generate

# Copiar el resto del código
COPY . .

# Compilar la aplicación NestJS
RUN npm run build

# --- Etapa 2: Producción ---
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

RUN npm ci --omit=dev || npm install --omit=dev
RUN npm install prisma

# Generar Prisma Client en el contenedor final
RUN npx prisma generate

EXPOSE 3001

# Sincronizar BD, sembrar datos, arrancar servidor
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node prisma/seed.js && node dist/src/main"]
