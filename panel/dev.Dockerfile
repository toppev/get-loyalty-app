FROM node:14-alpine

WORKDIR /usr/src/app
COPY package*.json .npmrc ./

ARG NPM_TOKEN

RUN echo //npm.pkg.github.com/:_authToken=${NPM_TOKEN} > ~/.npmrc
RUN npm install

RUN rm -f ~/.npmrc
COPY . .

EXPOSE 3002

CMD [ "npm", "start" ]
