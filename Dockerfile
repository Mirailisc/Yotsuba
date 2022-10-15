FROM node:16.17.1-alpine as setup
RUN npm i -g pnpm
WORKDIR /app
COPY ./package.json ./
COPY ./pnpm-lock.yaml ./

FROM setup as build
RUN pnpm i --frozen-lockfile
ARG DOCKER_TOKEN
ENV DISCORD_TOKEN=${DOCKER_TOKEN}
ARG CLIENT_ID
ENV CLIENT_ID=${CLIENT_ID}
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
COPY . ./
RUN pnpx prisma db pull

FROM build as deploy
CMD [ "pnpm", "start" ]