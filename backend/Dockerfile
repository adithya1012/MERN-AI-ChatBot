FROM node:latest
# v22.3.0 -> This node version which comes from :latest will work. Others are throwing error "ERR_DLOPEN_FAILED"

WORKDIR /app
 
COPY package.json .
 
RUN npm install
 
COPY . .
 
EXPOSE 3000
 
CMD ["npm", "run", "dev"]