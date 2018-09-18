FROM node:10-stretch AS build
WORKDIR /root/build
COPY . .
RUN apt update && apt install -y git build-essential libpng16-16 libpng-dev xcftools
RUN npm install && node node_modules/.bin/webpack --colors --display-error-details --config webpack.prod.config.js

FROM fholzer/nginx-brotli:v1.10.3

RUN apk add --no-cache libintl gettext

ADD ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /root/build/build /usr/share/nginx/html/
ADD ./entrypoint.sh /
ADD ./demostf.tmpl /etc/nginx/conf.d/
ADD ./upload.tmpl /etc/nginx/

CMD ["sh", "/entrypoint.sh"]
