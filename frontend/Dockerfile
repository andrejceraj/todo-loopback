# Check out https://hub.docker.com/_/node to select a new base image
FROM node:alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent
RUN npm install serve -g --silent


# add app
COPY . ./

#build app
RUN npm run build

# start app
CMD ["serve","-l", "3000", "-s", "build"]