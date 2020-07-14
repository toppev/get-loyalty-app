# Production Dockerfile
#
# Example usage:
# docker build . -t loyalty_app --build-arg FRONTEND_URL=http://localhost:3002 --build-arg API_URL=http://localhost:3001
# or just
# docker build . -t loyalty_app --build-arg FRONTEND_URL=http://localhost:3001
# to default to "/api"
# and finally,
# docker run loyalty_app

FROM node:12-alpine as build
WORKDIR /app
COPY . /app
ENV PATH /app/node_modules/.bin:$PATH

ARG FRONTEND_URL
RUN test -n "$FRONTEND_URL"
ENV PUBLIC_URL $FRONTEND_URL

# Default to /api
ARG API_URL=${FRONTEND_URL}/api
ENV REACT_APP_API_URL $API_URL

# Install (and cache) dependencies and build for production
RUN yarn
RUN yarn build

FROM nginx:alpine
# Copy the build directory to the nginx root
COPY --from=build /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]