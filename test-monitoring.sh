#!/bin/bash

echo "🧪 Testing monitoring setup locally..."

# Check if all required files exist
echo "📁 Checking required files..."
files=(
    "monitoring/prometheus/prometheus.yml"
    "monitoring/grafana/dashboards/frontend-monitoring.json"
    "monitoring/grafana/provisioning/datasources/datasource.yml"
    "monitoring/grafana/provisioning/dashboards/dashboard.yml"
    "docker-compose.monitoring.yml"
)

missing_files=()
for file in "${files[@]}"; do
    if [ ! -f "$file" ]; then
        missing_files+=("$file")
    fi
done

if [ ${#missing_files[@]} -ne 0 ]; then
    echo "❌ Missing files:"
    printf '%s\n' "${missing_files[@]}"
    exit 1
fi

echo "✅ All required files exist"

# Validate JSON files
echo "🔍 Validating JSON files..."
if command -v jq >/dev/null 2>&1; then
    jq . monitoring/grafana/dashboards/frontend-monitoring.json > /dev/null || {
        echo "❌ Invalid JSON in dashboard file"
        exit 1
    }
    echo "✅ JSON files are valid"
else
    echo "⚠️  jq not found, skipping JSON validation"
fi

# Test Docker Compose
echo "🐳 Testing Docker Compose configuration..."
docker-compose -f docker-compose.monitoring.yml config > /dev/null || {
    echo "❌ Docker Compose configuration is invalid"
    exit 1
}
echo "✅ Docker Compose configuration is valid"

# Test if monitoring stack can start
echo "🚀 Testing monitoring stack startup..."
docker-compose -f docker-compose.monitoring.yml up -d

# Wait for services
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
if ! curl -f http://localhost:9090/-/healthy >/dev/null 2>&1; then
    echo "❌ Prometheus is not healthy"
    docker-compose -f docker-compose.monitoring.yml logs prometheus
    docker-compose -f docker-compose.monitoring.yml down
    exit 1
fi

if ! curl -f http://localhost:3000/api/health >/dev/null 2>&1; then
    echo "❌ Grafana is not healthy"
    docker-compose -f docker-compose.monitoring.yml logs grafana
    docker-compose -f docker-compose.monitoring.yml down
    exit 1
fi

echo "✅ All services are healthy"

# Clean up
echo "🧹 Cleaning up..."
docker-compose -f docker-compose.monitoring.yml down

echo "🎉 Local monitoring test completed successfully!"
echo "✅ Your pipeline should work correctly in GitLab CI"
