#!/bin/bash
# Build script for deployment

echo "Installing frontend dependencies..."
npm install

echo "Building frontend..."
npm run build

echo "Build complete!"
