FROM node:18-alpine AS build

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .

RUN yarn build

CMD ["yarn", "start"]