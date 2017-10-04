FROM node:latest

#p directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app/
RUN npm install
#RUN apk del .gyp
# Bundle app source
COPY . /app
EXPOSE 8000
CMD [ "npm", "start" ]
