# Multi-stage build for React app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy package files
COPY package*.json yarn.lock* ./

# Install dependencies
RUN yarn install

# Copy source code
COPY . .

# Install dependencies again to ensure lockfile consistency
RUN yarn install

# Build the application
RUN yarn build

# Production stage with nginx
FROM nginx:alpine AS production

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
