FROM node:20-alpine AS builder

ENV  APP_HOME=/home/app/

WORKDIR $APP_HOME

COPY ./package-lock.json .
COPY ./package.json .

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

CMD ["npm", "run", "preview"]

# COPY cert.pem /etc/nginx/cert.pem
# COPY key.pem /etc/nginx/key.pem

# COPY --from=builder /home/app/dist /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["nginx", "-g", "daemon off;"]
