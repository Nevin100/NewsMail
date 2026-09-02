# Base image — Node.js LTS
FROM node:20-alpine

# Working directory
WORKDIR /app

# Copying package files first
COPY package*.json ./

# dependencies install
RUN npm install --production

# Copy complete code
COPY . .

# PORT exposing     
EXPOSE 8000

# server start
CMD ["node", "src/index.js"]