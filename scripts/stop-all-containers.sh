#!/usr/bin/env bash

echo "Stopping all docker containers..."

sudo docker stop $(docker ps -q)
