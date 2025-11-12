#!/bin/bash

cd "/Users/mahirarora/Desktop/Engineering Portfolio Bhav/portfolio"

# Initialize git if needed
if [ ! -d ".git" ]; then
  git init
fi

# Add remote (or update if exists)
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/Syinaric/bhavya-website.git

# Add all files
git add -A

# Commit
git commit -m "Initial commit: Portfolio for Bhavya Kurseja with dither background effect" || echo "No changes to commit"

# Set branch to main and push
git branch -M main
git push -u origin main

echo "Done! Files pushed to GitHub."

