FROM node:20

WORKDIR /financialApp

COPY package.json .

RUN npm install

COPY . .

CMD [ "npx", "nodemon", "server.js" ]