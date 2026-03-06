FROM node:20

WORKDIR /app

COPY package.json .
RUN npm install

COPY server.js .

CMD ["npx", "nodemon", "server.js"]