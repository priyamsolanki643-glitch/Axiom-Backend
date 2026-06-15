FROM node:22-alpine
# Node 22 specified for Cloud Build compatibility

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Compile TypeScript
RUN npx tsc --skipLibCheck || true

# Cloud Run sets PORT=8080 — expose it
EXPOSE 8080

# Run compiled JavaScript directly
CMD ["node", "dist/index.js"]
