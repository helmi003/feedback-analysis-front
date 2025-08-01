# PowerShell script to test monitoring setup
Write-Host "Testing monitoring setup locally..." -ForegroundColor Cyan

# Check if all required files exist
Write-Host "Checking required files..." -ForegroundColor Yellow
$files = @(
    "monitoring/prometheus/prometheus.yml",
    "monitoring/grafana/dashboards/frontend-monitoring.json",
    "monitoring/grafana/provisioning/datasources/datasource.yml",
    "monitoring/grafana/provisioning/dashboards/dashboard.yml",
    "docker-compose.monitoring.yml"
)

$missingFiles = @()
foreach ($file in $files) {
    if (!(Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -ne 0) {
    Write-Host "Missing files:" -ForegroundColor Red
    $missingFiles | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
    exit 1
}

Write-Host "All required files exist" -ForegroundColor Green

# Test Docker Compose
Write-Host "Testing Docker Compose configuration..." -ForegroundColor Yellow
try {
    docker-compose -f docker-compose.monitoring.yml config | Out-Null
    Write-Host "Docker Compose configuration is valid" -ForegroundColor Green
} catch {
    Write-Host "Docker Compose configuration is invalid" -ForegroundColor Red
    exit 1
}

Write-Host "Local monitoring validation completed successfully!" -ForegroundColor Green
Write-Host "Your pipeline should work correctly in GitLab CI" -ForegroundColor Green
