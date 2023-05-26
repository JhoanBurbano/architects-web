# Stage 1: Builder
FROM node:16.16.0 AS builder

WORKDIR /app

COPY package.json ./
RUN yarn install

COPY . .
RUN yarn build -- --configuration=production

# Stage 2: Final image
FROM nginx:1.17.3-alpine

COPY --from=builder /app/dist/client /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
