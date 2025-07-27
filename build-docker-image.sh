#!/bin/bash

# Build Docker Image Script
# Usage: ./build-docker-image.sh <environment> [--push]

set -e

ENVIRONMENT=${1:-development}
PUSH_FLAG=$2

echo "Building Docker image for environment: $ENVIRONMENT"

# Set image name based on environment
if [ "$ENVIRONMENT" = "production" ]; then
    IMAGE_TAG="$CI_REGISTRY_IMAGE:production-$CI_COMMIT_SHA"
elif [ "$ENVIRONMENT" = "staging" ]; then
    IMAGE_TAG="$CI_REGISTRY_IMAGE:staging-$CI_COMMIT_SHA"
else
    IMAGE_TAG="$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA"
fi

echo "Building image with tag: $IMAGE_TAG"

# Build the Docker image
docker build \
    --build-arg BUILD_ENVIRONMENT=$ENVIRONMENT \
    --tag $IMAGE_TAG \
    .

echo "Docker image built successfully: $IMAGE_TAG"

# Push if --push flag is provided
if [ "$PUSH_FLAG" = "--push" ]; then
    echo "Pushing image to registry..."
    docker push $IMAGE_TAG
    echo "Image pushed successfully"
fi

echo "Build process completed"
