#!/usr/bin/env bash

echo "Starting development environment. This may take a few minutes..."
echo "Using dev.docker-compose.yml"

sudo docker-compose -f dev.docker-compose.yml -p easy-loyalty-app up --build
