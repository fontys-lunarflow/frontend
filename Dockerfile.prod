FROM node:20-alpine

WORKDIR /app

# Copy source code
COPY . .

RUN npm ci
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

# Start in production mode
CMD ["npm", "run", "start"]
