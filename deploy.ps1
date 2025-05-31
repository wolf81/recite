# Ensure any errors stop the script
$ErrorActionPreference = "Stop"

# Define variables
$projectName = "recite"
$domain = "$projectName.wolftrail.net"

# Construct the distribution directory path using Join-Path
$distDir = Join-Path "dist" $projectName
$distDir = Join-Path $distDir "browser"

Write-Host "🔨 Building Angular project for production..."
ng build --configuration production --base-href "/"

Write-Host "📝 Writing CNAME file for domain..."
$cnamePath = Join-Path $distDir "CNAME"
Set-Content -Path $cnamePath -Value $domain

Write-Host "🚀 Deploying to GitHub Pages..."
npx angular-cli-ghpages --dir=$distDir --no-silent

Write-Host "✅ Deployment complete. Visit https://$domain"