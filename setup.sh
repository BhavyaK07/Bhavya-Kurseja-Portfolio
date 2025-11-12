#!/bin/bash

echo "Installing dependencies..."
npm install

echo ""
echo "Dependencies installed! Starting server on port 3002..."
PORT=3002 npm start

