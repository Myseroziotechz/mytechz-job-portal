#!/bin/bash

echo "========================================"
echo "PUSHING TO GITHUB - siva-dataworker"
echo "========================================"
echo ""
echo "This will authenticate and push your code."
echo ""

# Unset any cached credentials
git config --global --unset credential.helper
git config --local --unset credential.helper 2>/dev/null

# Set the remote URL with username
git remote set-url origin https://siva-dataworker@github.com/siva-dataworker/mytechz-job-portal.git

echo "Remote URL set to:"
git remote -v
echo ""

echo "Current status:"
git status
echo ""

echo "Pushing to GitHub..."
echo "A browser window will open for authentication."
echo "Please login with: sivabalan.dataworker@gmail.com"
echo ""

git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "SUCCESS! Code pushed to GitHub."
    echo "========================================"
else
    echo ""
    echo "========================================"
    echo "FAILED! Try these alternatives:"
    echo "1. Use GitHub Desktop (easiest)"
    echo "2. Create a Personal Access Token:"
    echo "   - Go to: https://github.com/settings/tokens"
    echo "   - Generate new token (classic)"
    echo "   - Use token as password when prompted"
    echo "========================================"
fi

read -p "Press Enter to continue..."
