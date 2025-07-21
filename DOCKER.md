# Docker Setup for Feedback Analysis Frontend

This project uses Docker for production deployment with optimized builds and Nginx serving.

## Prerequisites

- Docker
- Docker Compose

## Environment Configuration

The application uses environment variables for API endpoints. These are configured in the `.env` file:

```bash
VITE_SERVER_API_URL=http://localhost:3000/
VITE_FEEDBACK_API_URL=http://localhost:5000/
```

**Note**: You need to have your backend services running on ports 3000 and 5000 for the frontend to work properly.

## Production Deployment

Build and start the frontend application:

```bash
# Build and start the frontend
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop the service
docker-compose down
```

## Services

The Docker setup includes:

1. **feedback-frontend**: React application served by Nginx (port 3002)

## Accessing the Application

- **Frontend**: http://localhost:3002

## Production Features

- **Multi-stage build** for minimal image size
- **Nginx** for optimized static file serving
- **Gzip compression** enabled
- **Security headers** configured
- **Client-side routing** support
- **Static asset caching**

## Backend Services

This Docker setup only containerizes the frontend. You need to run your backend services separately:

### Option 1: Local Development
Run your backend services locally on:
- Port 3000: Main API server
- Port 5000: Analysis/Feedback API server

### Option 2: Docker Backend
If you have Docker containers for your backend services, you can extend the docker-compose.yml:

```yaml
services:
  feedback-frontend:
    # ... existing config
    depends_on:
      - backend-api
      - analysis-api

  backend-api:
    # Your backend service configuration
    ports:
      - "3000:3000"

  analysis-api:
    # Your analysis service configuration  
    ports:
      - "5000:5000"
```

### Option 3: External APIs
Update the `.env` file to point to external APIs:

```bash
VITE_SERVER_API_URL=https://your-api.domain.com/
VITE_FEEDBACK_API_URL=https://your-analysis-api.domain.com/
```

Then rebuild the container to apply the changes.

## Customization

### Custom Ports

If port 3002 conflicts with other services, modify the port mapping:

```yaml
ports:
  - "8080:80"  # Change 3002 to 8080 or any available port
```

### Environment Variables

To change API endpoints, update the `.env` file and rebuild:

```bash
# Update .env file
echo "VITE_SERVER_API_URL=https://new-api.com/" > .env
echo "VITE_FEEDBACK_API_URL=https://new-feedback-api.com/" >> .env

# Rebuild with new environment
docker-compose up --build
```

## Troubleshooting

### Build Issues

If you encounter build problems:

```bash
# Clean up and rebuild
docker-compose down --rmi all --volumes
docker-compose up --build --force-recreate
```

### API Connection Issues

If the frontend shows loading states or API errors:

1. **Check backend services**: Ensure your backend APIs are running on ports 3000 and 5000
2. **Check environment variables**: Verify `.env` file has correct API URLs
3. **Network connectivity**: Test API endpoints directly:
   ```bash
   curl http://localhost:3000/feedback
   curl http://localhost:5000/analysis
   ```

### Container Logs

Check container logs for errors:

```bash
# Frontend logs
docker-compose logs feedback-frontend
```

## Development vs Production

This setup is optimized for **production deployment**. For development:

- Use `yarn dev` to run the app locally with hot reload
- Backend services should be running separately
- No Docker needed for development workflow
