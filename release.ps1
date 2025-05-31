# Ensure any errors stop the script
$ErrorActionPreference = "Stop"

# Define variables
$projectName = "recite"
$distDir = "dist\$projectName\browser"
$customDomain = "recite.wolftrail.net"

Write-Host "🔨 Building Angular project for production..."
ng build --configuration production --base-href "/"

# Confirm the build output exists
if (-Not (Test-Path "$distDir\index.html")) {
    Write-Error "❌ Build failed or wrong directory. '$distDir\index.html' not found."
    exit 1
}

Write-Host "📝 Writing CNAME file for custom domain..."
Set-Content -Path "$distDir\CNAME" -Value $customDomain

Write-Host "🚀 Deploying to GitHub Pages..."
npx angular-cli-ghpages --dir=$distDir

Write-Host "✅ Deployment complete. Visit https://$customDomain"
