FROM node:20-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies (including object-assign and scheduler)
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start in development mode (listening on all interfaces)
CMD ["npm", "run", "dev"]
