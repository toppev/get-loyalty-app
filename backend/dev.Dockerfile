# Dev Dockerfile

# Should be same platform if run in non-container mode
# Otherwise sharp module (for example) will complain of different binaries, so don't use alpine
# or remove node_modules/sharp (as same files are mounted in dev mode)
FROM node:16

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
