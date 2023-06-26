FROM node:19.9.0-bullseye-slim

WORKDIR /app

COPY package*.json ./

RUN npm install
COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]