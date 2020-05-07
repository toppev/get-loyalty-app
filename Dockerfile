# Production Dockerfile
FROM node:12.16-alpine
WORKDIR /usr/src/app
COPY package*.json ./
# Don't install devDependencies
RUN npm install --only=production
COPY . .
EXPOSE 3001
CMD [ "npm", "start"]