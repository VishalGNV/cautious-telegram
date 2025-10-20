#!/bin/bash

# ============================================
# Waitlist Setup Script
# ============================================
# This script helps you set up the waitlist
# by checking prerequisites and guiding setup
# ============================================

set -e

echo "🚀 LinkHub Waitlist Setup"
echo "=========================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Must run from project root${NC}"
    exit 1
fi

echo "Step 1: Checking prerequisites..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js installed:${NC} $NODE_VERSION"
else
    echo -e "${RED}❌ Node.js not installed${NC}"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm installed:${NC} $NPM_VERSION"
else
    echo -e "${RED}❌ npm not installed${NC}"
    exit 1
fi

# Check if node_modules exists
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Dependencies not installed${NC}"
    echo "   Run: npm install"
    read -p "   Install now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npm install
        echo -e "${GREEN}✅ Dependencies installed${NC}"
    else
        exit 1
    fi
fi

echo ""
echo "Step 2: Checking environment configuration..."
echo ""

# Check for .env.local
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local exists${NC}"
    
    # Check if it has the required vars
    if grep -q "NEXT_PUBLIC_SUPABASE_URL" .env.local && grep -q "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" .env.local; then
        echo -e "${GREEN}✅ Required environment variables present${NC}"
        
        # Check if they're still placeholder values
        if grep -q "your-project-url\|your-anon-key-here\|your-publishable" .env.local; then
            echo -e "${YELLOW}⚠️  Environment variables contain placeholder values${NC}"
            echo "   Please update .env.local with your actual Supabase credentials"
            echo ""
            echo "   Get them from: https://supabase.com/dashboard/project/eqdysivaaharkwucvnep/settings/api"
            read -p "   Press Enter when ready to continue..."
        fi
    else
        echo -e "${RED}❌ Missing required environment variables${NC}"
        echo "   Creating .env.local template..."
        cat > .env.local << 'EOF'
# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/eqdysivaaharkwucvnep/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://eqdysivaaharkwucvnep.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
EOF
        echo -e "${YELLOW}⚠️  Please update .env.local with your Supabase credentials${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  .env.local not found${NC}"
    echo "   Creating .env.local template..."
    cat > .env.local << 'EOF'
# Supabase Configuration
# Get these from: https://supabase.com/dashboard/project/eqdysivaaharkwucvnep/settings/api

NEXT_PUBLIC_SUPABASE_URL=https://eqdysivaaharkwucvnep.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
EOF
    echo -e "${GREEN}✅ Created .env.local template${NC}"
    echo ""
    echo "Please update .env.local with your Supabase credentials:"
    echo "1. Open: https://supabase.com/dashboard/project/eqdysivaaharkwucvnep/settings/api"
    echo "2. Copy the 'anon' or 'public' key"
    echo "3. Paste it in .env.local"
    echo ""
    read -p "Press Enter when ready to continue..."
fi

echo ""
echo "Step 3: Database Setup Instructions"
echo ""
echo -e "${YELLOW}📋 You need to run SQL in Supabase to create the database tables${NC}"
echo ""
echo "1. Open Supabase SQL Editor:"
echo "   ${GREEN}https://supabase.com/dashboard/project/eqdysivaaharkwucvnep/editor${NC}"
echo ""
echo "2. Click 'New Query'"
echo ""
echo "3. Copy the SQL from:"
echo "   ${GREEN}docs/database-setup.md${NC}"
echo ""
echo "4. Paste and click 'Run'"
echo ""
read -p "Have you completed the database setup? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}⚠️  Please complete database setup before continuing${NC}"
    echo "   Instructions: docs/IMPLEMENTATION_PLAN.md (Phase 1)"
    exit 1
fi

echo ""
echo "Step 4: Starting development server..."
echo ""
echo -e "${GREEN}✅ All checks passed!${NC}"
echo ""
echo "Starting Next.js development server..."
echo "View at: ${GREEN}http://localhost:3000${NC}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
npm run dev
