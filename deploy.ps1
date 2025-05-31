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

# Configure Git to use the token for authentication
git config --global user.name "github-actions[bot]"
git config --global user.email "41898282+github-actions[bot]@users.noreply.github.com"

# Ensure Git uses the token to push
$env:GITHUB_TOKEN = $env:GITHUB_TOKEN
git remote set-url origin https://$env:GITHUB_TOKEN@github.com/wolf81/recite.git

Write-Host "🚀 Deploying to GitHub Pages..."
npx angular-cli-ghpages --dir=$distDir --no-silent

Write-Host "✅ Deployment complete. Visit https://$domain"