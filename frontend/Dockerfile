FROM node:20-alpine AS builder

ENV  APP_HOME=/home/app/

WORKDIR $APP_HOME

COPY frontend/package-lock.json .
COPY frontend/package.json .

RUN npm install

COPY frontend/ .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /home/app/dist /usr/share/nginx/html
COPY --from=builder /home/app/nginx.conf /etc/nginx/conf.d/default/conf
