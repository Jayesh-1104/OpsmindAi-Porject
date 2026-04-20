# 📌 Quick Reference Card

**Opsmind AI - Quick Commands & URLs**

## 🚀 Start Here

```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Frontend  
npm run dev:frontend

# Browser: Open
http://localhost:3000
```

## 🔗 Important URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Web Application |
| Backend API | http://localhost:5000 | API Server |
| API Proxy | http://localhost:3000/api | Frontend API Proxy |
| MongoDB Atlas | https://cloud.mongodb.com | Database Management |
| Google AI Studio | https://aistudio.google.com/app/apikey | Gemini API Keys |

## 📁 Important Files

| File | Location | Purpose |
|------|----------|---------|
| Backend Config | `opsmind-backend-new/.env` | Backend settings |
| Frontend Config | `opsmind-frontend/.env` | Frontend settings |
| Backend Entry | `opsmind-backend-new/server.js` | Start point |
| Frontend Entry | `opsmind-frontend/src/main.jsx` | Start point |

## 🛠️ Common Commands

```bash
# Installation
npm run install:all          # Install all dependencies

# Development
npm run dev:backend          # Start backend
npm run dev:frontend         # Start frontend
npm run build               # Build frontend
npm run preview             # Preview production

# Utilities
npx kill-port 5000          # Free backend port
npx kill-port 3000          # Free frontend port

# Troubleshooting
npm cache clean --force     # Clear npm cache
npm audit                   # Check vulnerabilities
npm list --depth=0          # List dependencies
```

## 🔑 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection
- `JWT_SECRET` - Token secret
- `GEMINI_API_KEY` - AI API key ⚠️ **UPDATE NEEDED**

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## 📊 API Endpoints

```
POST   /api/auth/register    Register user
POST   /api/auth/login       Login user

GET    /api/sop              Get all SOPs
POST   /api/sop              Create SOP
GET    /api/sop/:id          Get SOP
PUT    /api/sop/:id          Update SOP
DELETE /api/sop/:id          Delete SOP

POST   /api/ask              Ask agent
GET    /api/ask/stream       Stream response

GET    /api/test             Protected route
GET    /api/admin            Admin route
```

## 🐛 Port Issues

```bash
# Find what's using ports
Windows:  netstat -ano | findstr :5000
Mac/Linux: lsof -i :5000

# Kill process using port
Windows:  taskkill /PID <PID> /F
Mac/Linux: kill -9 <PID>
```

## 💻 System Requirements

- Node.js v16+ (`node --version`)
- npm v8+ (`npm --version`)
- Free ports: 3000, 5000
- MongoDB connection
- Gemini API key

## ✅ Verify Setup

```bash
# Check Node.js
node --version

# Check npm
npm --version

# Check dependencies
npm list --depth=0
cd opsmind-backend-new && npm list --depth=0
cd ../opsmind-frontend && npm list --depth=0

# Test backend
curl http://localhost:5000

# Test frontend
curl http://localhost:3000
```

## 📚 Documentation Files

- `SETUP.md` - Full setup guide
- `QUICKSTART.md` - 5-minute guide
- `COMMANDS.md` - All commands
- `TROUBLESHOOTING.md` - Common issues
- `PROJECT_STATUS.md` - Current status

## 🎯 First Steps

1. ⚠️ Add `GEMINI_API_KEY` to `opsmind-backend-new/.env`
2. Run: `npm run dev:backend`
3. Run: `npm run dev:frontend`
4. Open: http://localhost:3000
5. Register & login
6. Explore app!

## 🆘 Need Help?

1. Check if ports are free: `npx kill-port 3000` & `npx kill-port 5000`
2. Verify MongoDB connection in `.env`
3. Check console/terminal for error messages
4. See `TROUBLESHOOTING.md`
5. Review browser DevTools (F12)

## 🔐 Security Reminders

- Never commit `.env` files
- Keep API keys secret
- Use strong JWT_SECRET
- Rotate secrets in production
- Use HTTPS in production

---

**Print this card or bookmark for quick reference!**

Last Updated: April 20, 2026
