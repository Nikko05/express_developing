# 1. Use Node.js version 20
FROM node:20

# 2. Create a folder inside the container
WORKDIR /app

# 3. Copy our "recipe" for libraries
COPY package.json .
RUN npm install

# 4. Copy our actual code
COPY server.js .

# 5. Start the server
CMD ["npx", "nodemon", "server.js"]