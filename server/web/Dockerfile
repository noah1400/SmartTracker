# Stage 1: Build the Vue app
FROM node:latest AS build-stage

WORKDIR /app

COPY st-webinterface/package*.json ./

RUN npm install

COPY st-webinterface/ .

RUN npm run build

# Stage 2: Serve the app with Nginx
FROM nginx:stable-alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY vue-nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]