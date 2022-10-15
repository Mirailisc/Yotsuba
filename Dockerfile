FROM node:16.17.1-alpine as setup
RUN npm i -g pnpm
WORKDIR /app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

FROM setup as build
RUN pnpm i --frozen-lockfile
ENV DISCORD_TOKEN=$DISCORD_TOKEN
ENV CLIENT_ID=$CLIENT_ID
ENV DATABASE_URL=$DATABASE_URL
COPY . ./

FROM build as deploy
RUN pnpm start