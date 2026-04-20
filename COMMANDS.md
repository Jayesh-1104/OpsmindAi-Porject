# 📋 Available Commands

Quick reference for all npm commands available in the project.

## Root Level Commands

Located in: `./package.json`

```bash
# Start backend with hot reload (from root)
npm run dev:backend

# Start frontend with hot reload (from root)
npm run dev:frontend

# Build frontend for production
npm run build

# Preview production build locally
npm run preview

# Install all dependencies at once
npm run install:all
```

## Backend Commands

Located in: `./opsmind-backend-new/package.json`

```bash
cd opsmind-backend-new

# Start backend server (production)
npm start

# Start backend with hot reload using nodemon (development)
npm run dev
```

**Accessing Backend:**
- API Base: `http://localhost:5000`
- Health Check: `http://localhost:5000/`

## Frontend Commands

Located in: `./opsmind-frontend/package.json`

```bash
cd opsmind-frontend

# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Accessing Frontend:**
- Application: `http://localhost:3000`
- API Proxy: `http://localhost:3000/api`

## Development Workflow

### Setup & Installation

```bash
# Initial setup
npm run install:all

# Update dependencies
npm update
```

### Running Services

**In separate terminals:**

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Terminal 3: Monitor/Logs (optional)
cd opsmind-backend-new
npm run dev
```

### Building for Production

```bash
# Build frontend
npm run build

# Preview production build
npm run preview

# Backend is ready as-is (use 'npm start' when deployed)
```

## Utility Commands

### Dependency Management

```bash
# Check for outdated packages
npm outdated

# Check vulnerabilities
npm audit

# Fix vulnerabilities (use with caution)
npm audit fix

# Check dependency tree
npm list --all
```

### Port Management

```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

### Database/API Testing

```bash
# Test backend is running
curl http://localhost:5000

# Test API endpoint
curl http://localhost:5000/api/auth/login
```

## Environment Setup

### Backend Environment

```bash
cd opsmind-backend-new
# Copy .env.example to .env
cp .env.example .env
# Edit .env with your settings
```

### Frontend Environment

```bash
cd opsmind-frontend
# Copy .env.example to .env
cp .env.example .env
```

## Git Commands (Recommended)

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Your message"

# Push
git push origin main
```

## Debugging Commands

### Check Node Version
```bash
node --version
```

### Check npm Version
```bash
npm --version
```

### Check installed packages (Backend)
```bash
cd opsmind-backend-new
npm list
```

### Check installed packages (Frontend)
```bash
cd opsmind-frontend
npm list
```

### Check port usage (Windows)
```bash
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

### Check port usage (Mac/Linux)
```bash
lsof -i :5000
lsof -i :3000
```

## Continuous Integration Commands

```bash
# Run linting (if configured)
npm run lint

# Run tests (if configured)
npm test

# Build & Test pipeline
npm run build
npm test
```

## Troubleshooting Commands

### Clear npm Cache
```bash
npm cache clean --force
```

### Reinstall Dependencies
```bash
# Delete node_modules
rm -rf node_modules
rm package-lock.json

# Reinstall
npm install
```

### Reset Everything
```bash
# Root level
rm -rf node_modules package-lock.json

# Backend
cd opsmind-backend-new
rm -rf node_modules package-lock.json
cd ..

# Frontend
cd opsmind-frontend
rm -rf node_modules package-lock.json
cd ..

# Fresh install
npm run install:all
```

## Command Aliases (Optional)

Add to your shell profile to create shortcuts:

```bash
# In .bashrc or .zshrc or PowerShell profile:
alias dev-backend="npm run dev:backend"
alias dev-frontend="npm run dev:frontend"
alias dev-all="npm run dev:backend && npm run dev:frontend"
```

---

**For more details, see:**
- [SETUP.md](SETUP.md) - Full setup guide
- [QUICKSTART.md](QUICKSTART.md) - Quick start in 5 minutes
