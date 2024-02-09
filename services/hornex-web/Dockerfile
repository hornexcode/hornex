# Use official Node.js image as base image
FROM node:21-alpine3.18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to work directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the entire project to work directory
COPY . .

# Expose port 3000
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
