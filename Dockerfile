FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application for production
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the production server
CMD ["node", "server.js"]
