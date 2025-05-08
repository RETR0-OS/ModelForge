FROM ubuntu

RUN apt-get update
RUN apt-get install -y nodejs npm

COPY . /opt/ModelForge/Frontend
RUN cd /opt/ModelForge/Frontend && npm install

RUN npm start