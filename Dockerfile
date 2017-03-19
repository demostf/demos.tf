FROM alpine:3.5

RUN apk add --no-cache nginx libintl gettext
RUN ln -sf /dev/stdout /var/log/nginx/access.log && \
    ln -sf /dev/stderr /var/log/nginx/error.log

ADD ./nginx.conf /etc/nginx/nginx.conf
ADD ./build /usr/share/nginx/html/
ADD ./entrypoint.sh /
ADD ./demostf.tmpl /etc/nginx/conf.d/

CMD ["sh", "/entrypoint.sh"]
