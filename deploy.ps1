# Ensure any errors stop the script
$ErrorActionPreference = "Stop"

# Define variables
$projectName = "recite"
$distDir = "dist\$projectName\browser"
$customDomain = "$projectName.wolftrail.net"

Write-Host "🔨 Building Angular project for production..."
ng build --configuration production --base-href "/" --no-silent

Write-Host "📝 Writing CNAME file for custom domain..."
Set-Content -Path "$distDir\CNAME" -Value $customDomain

Write-Host "🚀 Deploying to GitHub Pages..."
npx angular-cli-ghpages --dir=$distDir

Write-Host "✅ Deployment complete. Visit https://$customDomain"
