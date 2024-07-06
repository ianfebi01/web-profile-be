FROM node:slim as backend-build

# We don't need the standalone Chromium
# ENV NODE_ENV=production
ENV PORT = 8000

ENV TS_NODE_PROJECT="./tsconfig.json"
#NODE_ENV=production

WORKDIR /usr/app

ADD ./ ./
RUN apt-get update -y && apt-get install -y openssl
RUN yarn install
# RUN npx prisma migrate dev
# RUN yarn global add ts-patch

RUN yarn build

FROM node:slim

WORKDIR /usr/app

COPY --from=backend-build /usr/app/build /usr/app/build
COPY --from=backend-build /usr/app/node_modules /usr/app/node_modules
COPY --from=backend-build /usr/app/package.json /usr/app
COPY --from=backend-build /usr/app/tsconfig.json /usr/app
COPY --from=backend-build /usr/app/yarn.lock /usr/app
COPY --from=backend-build /usr/app/prisma /usr/app/prisma

# RUN yarn add @prisma/client@latest
# RUN prisma generate
RUN apt-get update -y && apt-get install -y openssl

CMD ["node", "-r", "ts-node/register/transpile-only", "-r", "tsconfig-paths/register", "build/index.js"]
