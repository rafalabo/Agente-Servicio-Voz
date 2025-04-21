# --- Etapa de Construcción (Builder) ---
# Usamos una imagen oficial de Node.js (versión 18 LTS Alpine es ligera)
# Puedes ajustar la versión si tu código requiere una específica, pero 18 o 20 suelen ir bien.
FROM node:18-alpine AS builder

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia package.json y package-lock.json (importante para cachear dependencias)
COPY package*.json ./

# Instala TODAS las dependencias (incluyendo devDependencies como Vite, esbuild, cross-env)
# Usamos --legacy-peer-deps por el conflicto que vimos antes
RUN npm install --legacy-peer-deps

# Copia TODO el resto del código fuente (incluyendo server/, client/, vite.config.js, etc.)
COPY . .

# Ejecuta el script de build que definiste en package.json
# Esto creará la carpeta 'dist' con el frontend y backend compilados
RUN npm run build

# --- Etapa de Producción (Runner) ---
# Usamos la misma imagen base ligera de Node.js
FROM node:18-alpine

WORKDIR /app

# Copia SOLO los archivos necesarios para producción desde la etapa builder
COPY package*.json ./

# Instala SOLO las dependencias de PRODUCCIÓN (más pequeño y seguro)
# npm ci es generalmente preferido en CI/CD para instalaciones limpias basadas en package-lock.json
# Usamos --legacy-peer-deps aquí también por si acaso alguna dependencia de prod lo necesita.
RUN npm install --only=production --legacy-peer-deps

# Copia la carpeta 'dist' completa (con frontend y backend compilados) desde la etapa builder
COPY --from=builder /app/dist ./dist

# Expone el puerto INTERNO en el que escucha tu aplicación (el fallback que pusiste)
# Code Engine mapeará su puerto público a este puerto interno.
EXPOSE 5000

ENV NODE_ENV=production
# Define el comando para iniciar la aplicación en producción
# Usamos el script 'start' de tu package.json, que ya incluye cross-env NODE_ENV=production
# npm necesita saber dónde está el código, por eso se copia package.json primero

CMD ["node", "dist/index.js"]

# --- Notas ---
# 1. Si usas una versión de Node diferente a 18, cambia 'node:18-alpine' en ambas etapas FROM.
# 2. El puerto en EXPOSE (5000) debe coincidir con el puerto fallback en tu server/index.ts (process.env.PORT || 5000).