FROM node:alpine
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3000
EXPOSE 5000
CMD ["npm","run","build"]