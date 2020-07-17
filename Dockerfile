# Production Dockerfile
#
# Example usage:
#
# docker build . -t loyalty_app --build-arg FRONTEND_URL=http://localhost:3002 --build-arg API_URL=http://localhost:3001
# or just
# docker build . -t loyalty_app --build-arg FRONTEND_URL=http://localhost:3001
# to default to "/api"
#
# and run with,
# docker run -p 80:80 loyalty_app
#
# All available build-args:
#   WEBSITE_NAME - name or title of the app
#   WEBSITE_DESCRIPTION - description of the app
#   WEBSITE_KEYWORDS - keywords used in the <meta> tag

FROM node:12-alpine as build
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# Install (and cache) dependencies
COPY package.json /app/package.json
RUN yarn

ARG FRONTEND_URL
ENV PUBLIC_URL $FRONTEND_URL

ARG API_URL=${FRONTEND_URL}/api
ENV REACT_APP_API_URL $API_URL

ARG WEBSITE_NAME="Loyalty App"
ENV REACT_APP_NAME $WEBSITE_NAME

ARG WEBSITE_DESCRIPTION="Loyalty customer app for the business"
ENV REACT_APP_DESCRIPTION $WEBSITE_DESCRIPTION

ARG WEBSITE_KEYWORDS="loyalty app, business app, customer app"
ENV REACT_APP_KEYWORDS $WEBSITE_KEYWORDS

ARG PUBLIC_VAPID_KEY="none"
ENV REACT_APP_PUBLIC_VAPID_KEY $PUBLIC_VAPID_KEY


COPY . /app
RUN yarn build

FROM nginx:stable-alpine
# Copy build and nginx config
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]