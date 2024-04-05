#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Run the build process using npm
npm run build

# Move the frontend directory contents to /app/frontend/
rm -rf /app/frontend/*
mv * /app/frontend/

# Remove the tools directory
rm -rf /app/frontend/tools/