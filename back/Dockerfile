FROM node:20.18.1

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json
COPY package-lock.json /usr/src/app/package-lock.json

RUN npm install

COPY . /usr/src/app

# Set a temporary DATABASE_URL for build time
ENV DATABASE_URL="postgresql://anass:jQ8NvjQJtK2NYsIHux34tsewIUXxjBTu@dpg-ctj0aglsvqrc7385bfv0-a.oregon-postgres.render.com/barshop"

RUN npx prisma generate

# Use the real DATABASE_URL for runtime
RUN npm run migrate

RUN npm run build

CMD ["npm", "run", "start:prod"]