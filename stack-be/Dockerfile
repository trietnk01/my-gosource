FROM node:14-alpine
WORKDIR /usr/backend
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build-src
CMD [ "npm","run", "build"]