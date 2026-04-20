# 🚀 Quick Start Guide

Get Opsmind AI running in 5 minutes!

## Prerequisites Check ✅

Before starting, ensure you have:
- Node.js installed (`node --version`)
- npm installed (`npm --version`)
- MongoDB connection string (from MongoDB Atlas)
- Gemini API key (from Google AI Studio)

## Step 1: Setup Backend Credentials

1. Open `opsmind-backend-new/.env`
2. Update the `GEMINI_API_KEY`:
   ```env
   GEMINI_API_KEY=YOUR_ACTUAL_API_KEY_HERE
   ```
3. Save the file

> The MongoDB URI is already configured. If you need a different database, update `MONGO_URI`.

## Step 2: Verify Installations

All dependencies should be installed. Verify:

```bash
# Check root
npm list --depth=0

# Check backend
cd opsmind-backend-new
npm list --depth=0
cd ..

# Check frontend
cd opsmind-frontend
npm list --depth=0
cd ..
```

## Step 3: Start Backend (Terminal 1)

```bash
npm run dev:backend
```

Expected output:
```
Server running on port 5000
MongoDB Connected
```

## Step 4: Start Frontend (Terminal 2)

```bash
npm run dev:frontend
```

Expected output:
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:3000/
```

## Step 5: Open Application

Visit: **http://localhost:3000**

## First Steps in App

1. **Register Account**
   - Click "Register"
   - Fill in details
   - Submit

2. **Login**
   - Use your credentials to login

3. **Explore Features**
   - View Dashboard
   - Upload SOPs
   - Ask Agent questions

## Verify Everything Works

### Backend Health Check
```bash
curl http://localhost:5000
# Should return: "OpsMind Backend Running"
```

### API Test
```bash
curl http://localhost:5000/api/auth/login
# Should return: POST request expected
```

## Common Issues & Quick Fixes

### Port 3000 already in use
```bash
npx kill-port 3000
npm run dev:frontend
```

### Port 5000 already in use
```bash
npx kill-port 5000
npm run dev:backend
```

### MongoDB connection error
- Check your MongoDB URI in `.env`
- Verify your IP is whitelisted in MongoDB Atlas
- Test connection: `mongodb+srv://...`

### CORS error when calling API
- Ensure backend is running on port 5000
- Ensure frontend is running on port 3000
- Check backend CORS settings

## Environment Variables Quick Reference

**Backend (.env)**
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/OpsmindDB?retryWrites=true&w=majority
JWT_SECRET=opsmindsecret
GEMINI_API_KEY=your_gemini_api_key_here
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000/api
```

## Next Steps

- 📖 Read [SETUP.md](SETUP.md) for detailed configuration
- 📚 Check [COMMANDS.md](COMMANDS.md) for all available commands
- 🔧 Customize configuration as needed
- 🚀 Deploy to production when ready

---

**Need help?** Check the main [SETUP.md](SETUP.md) file for more details.
