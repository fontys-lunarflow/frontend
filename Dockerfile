FROM node:bookworm

WORKDIR /opt
COPY . /opt/
RUN npm install
RUN npm run build

EXPOSE 3000
CMD [ "npm", "run", "start"]
LABEL org.opencontainers.image.source=https://github.com/fontys-lunarflow/frontend
