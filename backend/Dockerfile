# Production Dockerfile
#
# Example usage:
# docker build . -t loyalty_backend --build-arg NPM_TOKEN=ajd12ydliauwdt
# docker run loyalty_backend
FROM node:16-alpine as builder

ARG NPM_TOKEN

WORKDIR /usr/src/app
COPY . .

# ~/.npmrc is used to authenticate, different from the project level .npmrc
RUN echo //npm.pkg.github.com/:_authToken=${NPM_TOKEN} > ~/.npmrc

RUN npm install
RUN npm run build
RUN rm -f ~/.npmrc



#
# Second stage
#
FROM node:16-alpine

ARG NPM_TOKEN

WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=builder /usr/src/app/build ./build
COPY --from=builder /usr/src/app/scripts ./scripts

RUN echo //npm.pkg.github.com/:_authToken=${NPM_TOKEN} > ~/.npmrc
RUN npm install --only=production
RUN rm -f ~/.npmrc

EXPOSE 3001
CMD [ "npm", "start"]
