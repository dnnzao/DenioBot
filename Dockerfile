FROM node:slim
WORKDIR /DiscordBot/DenioBot
COPY . /DiscordBot/DenioBot/
RUN npm install
EXPOSE 80 443 443/tcp
CMD node index.js