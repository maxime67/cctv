# ── Build ────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
# VITE_MAREE_API_KEY est injectée via --build-arg au moment du docker build
ARG VITE_MAREE_API_KEY
ENV VITE_MAREE_API_KEY=$VITE_MAREE_API_KEY
RUN npm run build

# ── Serve ────────────────────────────────────────────────────────────────────
FROM nginx:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
