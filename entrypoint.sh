#!/bin/sh
set -e

# If the directory is a git repo, try to pull latest changes
if [ -d ".git" ]; then
  echo "Checking for updates on main branch..."
  # We need to make sure the directory is marked as safe for git
  git config --global --add safe.directory /app
  
  # Try to fetch and pull
  if git fetch origin main; then
    # Force checkout main to be sure we are on the right branch
    git checkout -f main
    
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)

    if [ "$LOCAL" != "$REMOTE" ]; then
      echo "Updates found. Pulling latest from main..."
      git pull origin main
      echo "Changes detected, installing and rebuilding..."
      npm install
      npm run build
    else
      echo "Already up to date."
    fi
  else
    echo "Warning: Could not fetch from origin. Continuing with local version."
  fi
fi

# Ensure dependencies are installed if node_modules is missing
if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Installing..."
  npm install
fi

# Ensure build exists
if [ ! -d ".next" ]; then
  echo ".next build not found. Building..."
  npm run build
fi

echo "Starting application..."
exec npm run start
