#!/bin/bash
# Auto-start script for dev server

echo "🚀 Starting WaitlistHub dev server..."

# Kill any existing dev servers
pkill -f "next dev" 2>/dev/null

# Start the dev server in background
nohup npm run dev > /tmp/nextjs-dev.log 2>&1 &

echo "✅ Dev server started!"
echo "📝 Logs: tail -f /tmp/nextjs-dev.log"
echo "🌐 URL: https://ideal-waffle-69w555r97p4xh569q-3000.app.github.dev/"
