# FIRST STAGE -- BUILD
FROM node:20.11.0-alpine3.18 as build
LABEL authors="bsilva-c"

WORKDIR /usr/local/lib/
COPY ./package.json .

RUN npm install

COPY . /app/frontend/

# SECOND STAGE -- DEV
FROM node:20.11.0-alpine3.18 as dev
LABEL authors="bsilva-c"

ENV NODE_PATH="/node_modules/"
ENV NODE_ENV="development"

COPY --from=build /usr/local/lib/node_modules/ /node_modules/

WORKDIR /app/frontend/

CMD ["npm", "run", "dev"]

# SECOND STAGE -- WEBPACK BUILD
FROM node:20.11.0-alpine3.18 as prod
LABEL authors="bsilva-c"

ENV NODE_PATH="/node_modules/"
ENV NODE_ENV="production"

COPY --from=build /usr/local/lib/node_modules/ /node_modules/
COPY --from=build /app/frontend/ /tmp/app/frontend/

WORKDIR /tmp/app/frontend/

CMD ["sh", "./tools/entrypoint.sh"]
