FROM node:24-alpine as builder
WORKDIR /frontend
COPY ./Frontend/package*.json .
RUN npm install
COPY ./Frontend .
EXPOSE 3000
RUN npm run build

FROM nginx:alpine
COPY --from=builder /frontend/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf