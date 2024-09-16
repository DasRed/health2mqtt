FROM node:22-alpine

WORKDIR /var/www

RUN mkdir -p /var/www/src
COPY ./src /var/www/src
COPY ./.env /var/www/.env

COPY ./package.json /var/www/package.json
COPY ./package-lock.json /var/www/package-lock.json

ENV NODE_ENV production

CMD npm install --omit=dev && npm start
#CMD while true; do sleep 5; done
