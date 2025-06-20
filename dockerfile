FROM node:24

# Copy package.json and package-lock.json
COPY package*.json /dockernode/
# Copy the rest of the application files
COPY src /dockernode/src
# Set the working directory
WORKDIR /dockernode
# Install dependencies
RUN npm install

EXPOSE 3000

CMD ["node", "src/index.js"]
