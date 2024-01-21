FROM registry.headsc.dev/bhpc/images/nginx:master

EXPOSE 80/tcp
EXPOSE 443/tcp

COPY build /bh/www
COPY robots.txt /bh/www
COPY .nginx.conf /etc/nginx/conf.d/default.conf
RUN chown -R nginx:nginx /bh
