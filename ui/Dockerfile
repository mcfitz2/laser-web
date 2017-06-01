FROM node:latest

RUN echo "deb http://http.us.debian.org/debian/ testing non-free contrib main" >> /etc/apt/sources.list

RUN apt-get update && apt-get install -y libstdc++6 libc6
RUN apt-get -t testing -y install libc6-dev
RUN apt-get install -y build-essential python libzmq-dev 
    	 
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