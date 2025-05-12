FROM node:24-alpine

WORKDIR /frontend

COPY package*.json .

COPY tailwind.config.js .

RUN apk add --no-cache curl

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]