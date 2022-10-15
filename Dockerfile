FROM node:16.17.1-alpine as setup
RUN npm i -g pnpm
WORKDIR /app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

FROM setup as build
RUN pnpm i --frozen-lockfile

ARG DISCORD_TOKEN
ENV DISCORD_TOKEN=$DISCORD_TOKEN

ARG CLIENT_ID
ENV CLIENT_ID=$CLIENT_ID

ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

COPY . ./
RUN pnpm run prisma:generate

FROM build as deploy
CMD [ "pnpm", "start" ]