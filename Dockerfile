# Use an official Node.js runtime as a parent image
FROM my-local-node:20.10.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Set the working directory in the container
WORKDIR /usr/src/app

# Define the command to run your app
# CMD ["node", "app.js"]
CMD ["tail", "-f", "/dev/null"]
