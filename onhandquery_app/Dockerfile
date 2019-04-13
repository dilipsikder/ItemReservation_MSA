FROM node:8

WORKDIR /usr/src/onhand

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8092 
CMD [ "npm", "start" ]

