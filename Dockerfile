FROM node:5.11

ENV NODE_VERSION=v5.11.1

# Install git
RUN apt-get update && apt-get install -y git unzip

# From https://hub.docker.com/r/monostream/nodejs-gulp-bower/~/dockerfile/
# Global install gulp and bower
RUN npm set progress=false && \
    npm install --global --progress=false gulp bower && \
    echo '{ "allow_root": true }' > /root/.bowerrc

# Binary may be called nodejs instead of node
RUN ln -s /usr/bin/nodejs /usr/bin/node

COPY . /app
ENV APP_HOME /app

WORKDIR $APP_HOME
RUN npm install
RUN bower install
