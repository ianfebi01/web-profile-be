FROM node:slim as backend-build

# We don't need the standalone Chromium
# ENV NODE_ENV=production
ENV PORT = 8000

# ENV DATABASE_URL="postgresql://ianfebi01:jenengmu@localhost:5432/web-profile?schema=public"
ENV DATABASE_URL="postgres://default:A9fNe4UjbSmE@ep-mute-shape-49355252.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require"
ENV TS_NODE_PROJECT="./tsconfig.json"

ENV CLOUD_NAME = djyp9rr7s
ENV CLOUD_API_KEY = 213661622691574
ENV CLOUD_API_SECRET = So15t58Kz-uWGfPswLikzfoSHjc
ENV CLOUDINARY_URL=cloudinary://213661622691574:So15t58Kz-uWGfPswLikzfoSHjc@djyp9rr7s


ENV JWT_TOKEN_SECRET=iangantengsekali

ENV USER="ianfebi01@gmail.com"
#NODE_ENV=production

WORKDIR /usr/app

ADD ./ ./
RUN apt-get update -y && apt-get install -y openssl
RUN yarn install
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
