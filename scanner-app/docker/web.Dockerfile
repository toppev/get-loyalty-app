# Dockerfile to serve the static files created by "flutter build web"
#
# For example,
# ~/scanner-app$ docker build . -t loyalty-scanner-web -f docker/web.Dockerfile && docker run -p 8080:80 loyalty-scanner-web
FROM nginx:stable-alpine

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY /build/web /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
