FROM my-local-node:20.10.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY public public
COPY router router
COPY Set_SOC_ref Set_SOC_ref
COPY views views 

# Set the working directory in the container
WORKDIR /usr/src/app/router