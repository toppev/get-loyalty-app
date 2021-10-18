# Production Dockerfile
FROM node:16-alpine as build
ARG NPM_TOKEN
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

COPY package*.json /app/

RUN echo //npm.pkg.github.com/:_authToken=${NPM_TOKEN} > ~/.npmrc
RUN npm install --only=production
RUN rm -f ~/.npmrc

COPY . /app
RUN npm build

FROM nginx:stable-alpine
# Copy build and nginx config
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
