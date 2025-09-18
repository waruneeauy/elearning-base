#!/bin/sh

# Replace environment variables in static files
for file in /app/static/assets/*.js
do
  if [ -f "$file" ]; then
    sed -i 's|DATABASE_URL|'${DATABASE_URL}'|g' $file
    sed -i 's|SECRET_KEY|'${SECRET_KEY}'|g' $file
    sed -i 's|SECRET_KEY_CLIENT|'${SECRET_KEY_CLIENT}'|g' $file
  fi
done

# Wait for database to be ready
echo "Waiting for database to be ready..."
until npx prisma db push --accept-data-loss 2>/dev/null; do
  echo "Database is unavailable - sleeping"
  sleep 2
done

echo "Database is ready - executing command"

# Run database migrations
npx prisma db push

# Start the application
node ./dist/app.js