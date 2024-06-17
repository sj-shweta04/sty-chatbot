# FROM node:16.15.0-alpine AS appbuild

# WORKDIR /app

# ENV REACT_APP_SERVER_API_URL_BACKEND="http://65.2.51.139:8002/"

# ENV REACT_APP_SERVER_API_URL_AI_OLD="http://65.2.51.139:9520/"

# ENV REACT_APP_SERVER_API_URL_AI_NEW="http://65.2.51.139:6740/"

# COPY . .
# COPY package.json ./
# COPY package-lock.json ./

# RUN npm install --legacy-peer-deps
# RUN npm install
# RUN npm run build


# FROM nginx:alpine
# WORKDIR /usr/share/nginx/html
# COPY *.json ./
# COPY --from=appbuild /app/build/. .
# EXPOSE 80
# CMD ["nginx","-g","daemon off;"]

# Use the official Node.js image as base
FROM node:16.15.0-alpine

# Set the working directory inside the container
WORKDIR /app

# ENV REACT_APP_SERVER_API_URL_BACKEND="http://65.1.198.137:8002/"

# ENV REACT_APP_SERVER_API_URL_AI_OLD="http://65.1.198.137:9520/"

# # ENV REACT_APP_SERVER_API_URL_AI_NEW="http://65.2.51.139:6740/"

# ENV REACT_APP_SERVER_API_URL_AI_NEW="http://65.2.51.139:4200/"

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install --production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app runs on
EXPOSE 3008

# Command to run your app
CMD ["npm", "start"]
