# ── Stage 1: Build ─────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# Install ALL dependencies (including dev) for compiling TypeScript
COPY package*.json ./
RUN npm install

# Copy source and compile TypeScript → JavaScript
COPY . .
RUN npx tsc --skipLibCheck --outDir dist || true

# ── Stage 2: Production Runtime ─────────────────────────────────────────────
FROM node:20-slim AS runner

WORKDIR /app

# Only install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy compiled output from builder stage
COPY --from=builder /app/dist ./dist

# Cloud Run sets PORT=8080 — expose it
EXPOSE 8080

# Run compiled JavaScript directly with node (no tsx needed)
CMD ["node", "dist/index.js"]
