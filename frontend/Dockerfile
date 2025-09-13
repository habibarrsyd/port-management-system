# ---------- Stage 1: Build React Vite ----------
FROM node:18-slim AS build
WORKDIR /app
COPY package*.json ./
# Lebih reproducible:
RUN npm ci && npm cache clean --force
COPY . .
# Baca env saat build (opsional)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ---------- Stage 2: Serve dengan Nginx ----------
FROM nginx:alpine
# Pakai config custom
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
