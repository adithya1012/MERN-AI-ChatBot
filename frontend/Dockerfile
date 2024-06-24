# FROM node:15.5.0
FROM node:latest
 
WORKDIR /app
 
COPY package.json .
 
RUN npm install
 
COPY . .
 
EXPOSE 5173
 
CMD ["npm", "run", "dev"]
