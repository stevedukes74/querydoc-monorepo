# Use official Node.js LTS image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production

# Copy source code
COPY . .

# Build typescript
RUN yarn Build

# Expose port
EXPOSE 8080

# Start server
CMD ["node", "dist/server.js"]
