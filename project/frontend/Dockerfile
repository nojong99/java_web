# React build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package.json ./
COPY src ./src
COPY public ./public
RUN npm install && npm run build

# Nginx serve stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 