#!/usr/bin/env bash

echo "Starting development environment. This may take a few minutes..."

echo "The web apps are available at:"
echo "http://localhost:3000"
echo "http://localhost:3002"

: '
echo "Opening the web apps..."
{
  xdg-open 'http://localhost:3000' && xdg-open 'http://localhost:3002'
} || echo "Failed to open browser"
'

echo "Using dev.docker-compose.yml"
sudo docker-compose -f dev.docker-compose.yml -p easy-loyalty-app up --build
