# Multi-stage build for React app
FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Install Yarn and security updates
RUN apk update && apk upgrade && \
    corepack enable && corepack prepare yarn@stable --activate

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
FROM nginx:1.27-alpine AS production

# Update packages for security
RUN apk update && apk upgrade && rm -rf /var/cache/apk/*

# Copy built app from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx (nginx automatically drops privileges to nginx user for worker processes)
CMD ["nginx", "-g", "daemon off;"]
