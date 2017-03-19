#!/bin/sh

for f in /etc/nginx/conf.d/*.tmpl
do
     envsubst < $f > $f.conf
done

exec nginx
