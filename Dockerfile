FROM node:15-stretch AS build
WORKDIR /root/build
RUN apt update && apt install -y git build-essential libpng16-16 libpng-dev xcftools webp
COPY . .
RUN rm package-lock.json && make

FROM fholzer/nginx-brotli:v1.19.1

RUN apk add --no-cache libintl gettext

ADD ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /root/build/build /usr/share/nginx/html/
ADD ./entrypoint.sh /
ADD ./demostf.tmpl /etc/nginx/conf.d/
ADD ./upload.tmpl /etc/nginx/

CMD ["sh", "/entrypoint.sh"]
