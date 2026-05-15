# ── Stage 1: build ───────────────────────────────────────────────────────────
FROM node:24-alpine AS build
WORKDIR /app

# Ensure npm version matches the one used to generate package-lock.json
RUN npm install -g npm@11

# Cache npm install layer
COPY package.json package-lock.json ./
RUN npm install --prefer-offline

COPY . .
RUN npx ng build --configuration production

# ── Stage 2: serve with nginx ─────────────────────────────────────────────────
FROM nginx:1.27-alpine
COPY --from=build /app/dist/taskforge/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
