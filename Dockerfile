FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

# Installation des dépendances incluant les devDependencies pour la compilation TypeScript
RUN npm install

# Copie des fichiers source
COPY . .

# Build du projet TypeScript
RUN npm run build

FROM node:18-alpine

WORKDIR /usr/src/app

# Copie des fichiers nécessaires depuis l'étape de build
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

ENV PORT=8000
ENV HOST=0.0.0.0
EXPOSE ${PORT}

CMD ["node", "dist/index.js"]