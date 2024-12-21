FROM node:20.18.1

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run migrate

RUN npm run build

CMD ["npm", "run", "start:prod"]
