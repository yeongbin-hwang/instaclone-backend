FROM node:14-alpine

WORKDIR /app

COPY package*.json .

RUN npm i
# RUN npm ci

COPY . .

ENV PORT=8002

EXPOSE $PORT

CMD ["npm", "start"]