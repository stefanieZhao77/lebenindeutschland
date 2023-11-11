# Use the latest Node.js image as a parent image
FROM node:latest

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install any dependencies
RUN npm install

# Bundle the source code inside the Docker image
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000

# Run the application when the container launches
CMD ["node", "src/index.js"]
