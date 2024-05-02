# FIRST STAGE -- BUILD
FROM node:20.11.0-alpine3.18 as build
LABEL authors="bsilva-c"

WORKDIR /usr/local/lib/
COPY ./package.json .

RUN npm install

# SECOND STAGE -- DEV
FROM node:20.11.0-alpine3.18 as dev
LABEL authors="bsilva-c"

ENV NODE_PATH="/node_modules/"
ENV NODE_ENV="development"

COPY --from=build /usr/local/lib/node_modules/ /node_modules/

WORKDIR /app/
COPY . .

CMD ["npm", "run", "dev"]

# SECOND STAGE -- PROD
FROM node:20.11.0-alpine3.18 as prod
#FROM gcr.io/distroless/nodejs20-debian12 as prod
LABEL authors="bsilva-c"

ENV NODE_PATH="/node_modules/"
ENV NODE_ENV="production"

COPY --from=build /usr/local/lib/node_modules/ /node_modules/

WORKDIR /app/
COPY ./src/ ./src/
COPY ./static/ ./static/
COPY ./babel.config.json ./babel.config.json
COPY ./index.html ./index.html
COPY ./webpack.config.js ./webpack.config.js

CMD ["/node_modules/webpack/bin/webpack.js", "-c", "/app/webpack.config.js", "--mode", "production"]
