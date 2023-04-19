# docker build -t asia.gcr.io/ivory-vim-300504/phase2-ui:v0.5.8-dev .

# The build stage
FROM node:16-alpine as builder

WORKDIR /app

## Build args
ARG API_DOMAIN

ARG WS_DOMAIN

ARG IPFS_DOMAIN 

## Build environment vars
ENV REACT_APP_API_DOMAIN=${API_DOMAIN}

ENV REACT_APP_WS_DOMAIN=${WS_DOMAIN}

ENV REACT_APP_IPFS_DOMAIN=${IPFS_DOMAIN}

COPY package.json .

COPY yarn.lock .

RUN apk add --no-cache git

RUN yarn ci

COPY . .

RUN yarn build

# The actual prod image
FROM nginx:1.20.1-alpine

COPY --from=builder /app/build /var/www/html

COPY nginx.config /etc/nginx/conf.d/default.conf