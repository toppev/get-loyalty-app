#!/usr/bin/env bash

# Check README.md for prerequisites

echo "Starting development environment. This may take a few minutes..."

echo "The web apps are available at:"
echo "loyalty-app: http://localhost:3000"
echo "loyalty-panel: http://localhost:3002"

: '
echo "Opening the web apps..."
{
  xdg-open 'http://localhost:3000' && xdg-open 'http://localhost:3002'
} || echo "Failed to open browser"
'

echo "Using dev.docker-compose.yml"
sudo docker-compose -f dev.docker-compose.yml -p get-loyalty-app up --build
