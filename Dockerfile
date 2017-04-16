FROM fholzer/nginx-brotli:v1.10.3

RUN apk add --no-cache libintl gettext

ADD ./nginx.conf /etc/nginx/nginx.conf
ADD ./build /usr/share/nginx/html/
ADD ./entrypoint.sh /
ADD ./demostf.tmpl /etc/nginx/conf.d/
ADD ./upload.tmpl /etc/nginx/

CMD ["sh", "/entrypoint.sh"]
