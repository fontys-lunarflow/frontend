FROM node:20-alpine

WORKDIR /app

# Copy source code
COPY . .

RUN npm ci

RUN npm run build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=development
ENV HOSTNAME="0.0.0.0"

# Start in development mode (for now)
CMD ["npm", "run", "start"]
