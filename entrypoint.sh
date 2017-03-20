#!/bin/sh

export DOLLAR='$'

envsubst < /etc/nginx/upload.tmpl > /etc/nginx/upload.conf
for f in /etc/nginx/conf.d/*.tmpl
do
     envsubst < $f > $f.conf
done

exec nginx
