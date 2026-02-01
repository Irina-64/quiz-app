#!/bin/bash
echo "Starting MongoDB..."
mongod --fork --logpath /tmp/mongodb.log

echo "Starting backend..."
cd backend && npm start &

echo "Starting frontend..."
cd frontend && npm start &

echo "Development servers are starting..."
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000/api/test"
