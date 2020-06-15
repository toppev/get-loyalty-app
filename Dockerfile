# Production Dockerfile
FROM node:12.16-alpine
ARG NPM_TOKEN
WORKDIR /usr/src/app
COPY package*.json .npmrc ./
# ~/.npmrc is used to authenticate, different from project level .npmrc
RUN echo //npm.pkg.github.com/:_authToken=${NPM_TOKEN} > ~/.npmrc
# Don't install devDependencies
RUN npm install --only=production
RUN rm -f ~/.npmrc
COPY . .
EXPOSE 3001
CMD [ "npm", "start"]