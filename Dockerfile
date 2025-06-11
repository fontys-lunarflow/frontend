FROM node:20-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install dependencies
RUN npm install
RUN npm run build

# Expose port
EXPOSE 3000
ENV NODE_ENV=production

# Start in production mode
CMD ["npm", "start"]
