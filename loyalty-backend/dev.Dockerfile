# Dev Dockerfile

FROM node:14

WORKDIR /usr/src/app
COPY package*.json .npmrc ./

ARG NPM_TOKEN

# ~/.npmrc is used to authenticate, different from the project level .npmrc
RUN echo //npm.pkg.github.com/:_authToken=${NPM_TOKEN} > ~/.npmrc

RUN npm install
RUN rm -f ~/.npmrc
COPY . .
EXPOSE 3001

CMD [ "npm", "run-script", "dev"]
