# Use the official lightweight Node.js 20 image.
FROM node:20-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Ensure the port binding respects the dynamic Cloud Run PORT
# Cloud Run automatically sets the PORT environment variable (default 8080)
EXPOSE 8080

# Run the web service on container startup using your start script
CMD [ "npm", "run", "start" ]
