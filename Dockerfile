FROM node:16-buster AS build
WORKDIR /root/build
RUN apt update && apt install -y git build-essential libpng16-16 libpng-dev xcftools webp nasm
COPY package*.json ./
RUN npm ci
COPY postcss.config.js tsconfig.json webpack.*.config.js Makefile ./
COPY src src
RUN make

FROM nginx:alpine AS ngx_brotli_build

ENV NGX_MODULE_COMMIT 9aec15e2aa6feea2113119ba06460af70ab3ea62
ENV NGX_MODULE_PATH ngx_brotli

RUN wget "http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz" -O nginx.tar.gz && \
  wget "https://github.com/google/ngx_brotli/archive/${NGX_MODULE_COMMIT}.tar.gz" -O ${NGX_MODULE_PATH}.tar.gz

# For latest build deps, see https://github.com/nginxinc/docker-nginx/blob/master/mainline/alpine/Dockerfile
RUN apk add --no-cache --virtual .build-deps \
  gcc \
  libc-dev \
  make \
  openssl-dev \
  pcre-dev \
  zlib-dev \
  linux-headers \
  libxslt-dev \
  gd-dev \
  geoip-dev \
  perl-dev \
  libedit-dev \
  mercurial \
  bash \
  alpine-sdk \
  findutils \
  brotli-dev

# Reuse same cli arguments as the nginx:alpine image used to build
RUN CONFARGS=$(nginx -V 2>&1 | sed -n -e 's/^.*arguments: //p') \
  tar -zxf nginx.tar.gz && \
  tar -xzf "${NGX_MODULE_PATH}.tar.gz" && \
  cd nginx-$NGINX_VERSION && \
  ./configure --with-compat $CONFARGS --add-dynamic-module="$(pwd)/../${NGX_MODULE_PATH}-${NGX_MODULE_COMMIT}" && \
  make && make install

# save /usr/lib/*so deps
RUN mkdir /so-deps && cp -L $(ldd /usr/local/nginx/modules/ngx_http_brotli_filter_module.so 2>/dev/null | grep '/usr/lib/' | awk '{ print $3 }' | tr '\n' ' ') /so-deps

# prepend load_module commands to main nginx.conf
RUN echo "load_module /usr/local/nginx/modules/ngx_http_brotli_filter_module.so;" | cat - /etc/nginx/nginx.conf > /tmp/out && mv /tmp/out /etc/nginx/nginx.conf
RUN echo "load_module /usr/local/nginx/modules/ngx_http_brotli_static_module.so;" | cat - /etc/nginx/nginx.conf > /tmp/out && mv /tmp/out /etc/nginx/nginx.conf

FROM nginx:alpine

COPY --from=ngx_brotli_build /so-deps /usr/lib
COPY --from=ngx_brotli_build /etc/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=ngx_brotli_build /usr/local/nginx/modules/ngx_http_brotli_filter_module.so /usr/local/nginx/modules/ngx_http_brotli_filter_module.so
COPY --from=ngx_brotli_build /usr/local/nginx/modules/ngx_http_brotli_static_module.so /usr/local/nginx/modules/ngx_http_brotli_static_module.so

RUN apk add --no-cache libintl gettext

ADD ./nginx.conf /etc/nginx/nginx.conf
COPY --from=build /root/build/build /usr/share/nginx/html/
ADD ./entrypoint.sh /
ADD ./demostf.tmpl /etc/nginx/conf.d/
ADD ./upload.tmpl /etc/nginx/

CMD ["sh", "/entrypoint.sh"]
