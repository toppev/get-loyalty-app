# Production Dockerfile
#
# Example usage:
# docker build . -t loyalty_backend --build-arg FRONTEND_ORIGIN=http://localhost:3001 --build-arg PUBLIC_URL=http://localhost:3002
# or just (recommended)
# docker build . -t loyalty_backend --build-arg FRONTEND_ORIGIN=http://demo.getloyalty.app
# and "/api" is assumed
# docker run loyalty_backend

ARG FRONTEND_ORIGIN
RUN test -n "$FRONTEND_ORIGIN"
ENV FRONTEND_ORIGIN ${FRONTEND_ORIGIN}

# The public API URL (default to /api)
ARG PUBLIC_URL=${FRONTEND_ORIGIN}/api
ENV PUBLIC_URL ${PUBLIC_URL}

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