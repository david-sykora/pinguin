FROM node:20

COPY . /usr/src/app/

WORKDIR /usr/src/app
RUN corepack enable pnpm
RUN pnpm install
RUN pnpm run build

CMD ["npm", "start"]
