#!/bin/bash
python3 ../manage.py collectstatic --noinput

mkdir -p /usr/share/nginx/static/
mkdir -p /usr/share/nginx/media/

cp -rf ../frontend/static/ /usr/share/nginx/static/
cp -rf ../frontend/media/ /usr/share/nginx/media/