# ---------- Stage 1: Build React Vite ----------
FROM node:18-slim AS build

# Set working directory
WORKDIR /app

# Copy package.json & package-lock.json / yarn.lock
COPY package*.json ./

# Install dependencies dan bersihkan cache
RUN npm install && npm cache clean --force

# Copy semua source code
COPY . .

# Build production
RUN npm run build

# ---------- Stage 2: Serve dengan Nginx ----------
FROM nginx:alpine

# Hapus default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy hasil build dari stage sebelumnya
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]

