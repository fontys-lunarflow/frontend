FROM node:lts

RUN apt update && apt upgrade -y
RUN apt clean
WORKDIR /opt
COPY . /opt/
RUN npm install
RUN npm run build

EXPOSE 3000
CMD [ "npn", "run", "start"]
LABEL org.opencontainers.image.source=https://github.com/fontys-lunarflow/frontend
