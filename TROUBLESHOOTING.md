# 🔧 Troubleshooting Guide

Common issues and how to resolve them.

## Connection Issues

### Problem: Backend won't start - MongoDB connection error

**Error:** `DB Error: connection refused` or similar

**Solutions:**
1. Verify MongoDB URI in `opsmind-backend-new/.env`
2. Check MongoDB Atlas network access settings
3. Whitelist your IP address in MongoDB Atlas
4. Test connection string directly
5. Ensure VPN isn't blocking connection

**Test MongoDB:**
```bash
# From MongoDB shell or Atlas
mongo "mongodb+srv://username:password@cluster..."
```

### Problem: Frontend can't connect to backend

**Error:** `CORS error` or `Failed to fetch`

**Solutions:**
1. Ensure backend is running: `npm run dev:backend`
2. Verify API URL in `opsmind-frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
3. Check backend CORS settings in `opsmind-backend-new/server.js`
4. Verify proxy configuration in `opsmind-frontend/vite.config.js`
5. Check if ports are correct (frontend 3000, backend 5000)

## Port Issues

### Problem: Port 5000 already in use

**Solutions:**

**Windows (PowerShell):**
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use npx utility
npx kill-port 5000

# Then restart
npm run dev:backend
```

**Mac/Linux:**
```bash
# Find process
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Problem: Port 3000 already in use

**Windows:**
```bash
npx kill-port 3000
npm run dev:frontend
```

**Mac/Linux:**
```bash
lsof -i :3000
kill -9 <PID>
```

### Problem: Both ports in use - Check what's running

```bash
# Windows - List all listening ports
netstat -ano | findstr LISTENING

# Mac/Linux - Check all processes
lsof -i -P -n | grep LISTEN
```

## Installation & Dependency Issues

### Problem: Dependencies not installed properly

**Solutions:**
```bash
# Clear cache
npm cache clean --force

# Remove node_modules and lock files
rm -rf node_modules package-lock.json

# Fresh install
npm install

# For backend
cd opsmind-backend-new
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
cd ..

# For frontend
cd opsmind-frontend
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
cd ..
```

### Problem: `Module not found` error

**Solutions:**
```bash
# Install specific missing package
npm install <package-name>

# Or from problematic directory
cd opsmind-backend-new
npm install

# Check for typos in imports
# Verify all require/import statements
```

### Problem: npm ERR! code ERESOLVE or conflicting dependencies

**Solutions:**
```bash
# Use legacy dependency resolution
npm install --legacy-peer-deps

# Or for specific directory
cd opsmind-backend-new
npm install --legacy-peer-deps
```

## Runtime Issues

### Problem: Backend starts but doesn't connect to database

**Error:** MongoDB connection keeps retrying

**Solutions:**
1. Check `.env` file is in correct directory: `opsmind-backend-new/.env`
2. Verify `MONGO_URI` format is correct
3. Ensure `.env` file has no extra spaces or quotes
4. Check for typos in database name

### Problem: API returns 401 (Unauthorized)

**Error:** Protected routes return 401

**Solutions:**
1. Ensure JWT token is being sent
2. Check JWT secret matches in `.env`: `JWT_SECRET`
3. Verify token format in requests
4. Clear browser cookies/localStorage
5. Re-login to get new token

### Problem: File upload fails

**Error:** Multer error or upload rejected

**Solutions:**
1. Check `uploadMiddleware.js` configuration
2. Verify upload folder exists: `opsmind-backend-new/uploads/`
3. Check file size limits
4. Ensure folder has write permissions
5. Check MIME type restrictions

## Frontend Issues

### Problem: Page won't load or blank page

**Error:** No errors in console but blank screen

**Solutions:**
```bash
# Hard refresh browser
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)

# Clear browser cache
# Close all browser instances
# Restart dev server
npm run dev:frontend

# Check browser console (F12) for JavaScript errors
```

### Problem: Vite HMR not working (changes don't hot reload)

**Solutions:**
1. Verify Vite dev server is running
2. Check browser console for HMR errors
3. Restart frontend dev server
4. Clear browser cache
5. Check firewall settings

### Problem: API requests failing with 404

**Error:** `GET /api/endpoint 404`

**Solutions:**
1. Verify backend is running on port 5000
2. Check API endpoint URL is correct
3. Verify routes are defined in backend
4. Check proxy config in `vite.config.js`
5. Monitor network tab in DevTools

## Environment Configuration Issues

### Problem: .env file not being read

**Solutions:**
1. Verify .env file is in correct directory
2. Check filename exactly: `.env` (not `.env.local`)
3. Restart dev server after changing .env
4. For backend: restart with `npm run dev`
5. Verify file isn't in .gitignore accidentally

### Problem: Environment variables undefined

**Error:** `VITE_API_URL is undefined` or similar

**Solutions:**
```bash
# Backend - verify file path
path.resolve(__dirname, ".env")

# Frontend - variables must start with VITE_
VITE_API_URL=http://localhost:5000/api

# Restart dev server
npm run dev:frontend
```

## API Issues

### Problem: CORS errors when making requests

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solutions:**
1. Check backend CORS configuration:
   ```javascript
   app.use(cors({ origin: "http://localhost:3000", credentials: true }));
   ```
2. Verify frontend origin matches
3. Restart backend after changes
4. Check if browser has CORS extension that might interfere

### Problem: Request body not parsed (undefined)

**Error:** `req.body is undefined`

**Solutions:**
1. Check body parser middleware is configured:
   ```javascript
   app.use(express.json());
   ```
2. Verify Content-Type header is set to `application/json`
3. Restart backend

### Problem: Timeout errors on API calls

**Error:** `Request timeout` or hanging requests

**Solutions:**
1. Check backend is responding: `curl http://localhost:5000`
2. Monitor backend logs for errors
3. Check MongoDB is accessible
4. Verify firewall isn't blocking requests
5. Increase timeout settings if needed

## Database Issues

### Problem: Mongoose model errors

**Error:** `Model not defined` or schema errors

**Solutions:**
1. Verify model files in `opsmind-backend-new/models/`
2. Check exports/requires syntax
3. Ensure models are properly registered
4. Verify field names match in queries

### Problem: MongoDB Atlas connection limits reached

**Error:** `connection pool exhausted` or similar

**Solutions:**
1. Check connection string pool settings
2. Close unused connections
3. Increase maxPoolSize if needed:
   ```env
   MONGO_URI=mongodb+srv://...?maxPoolSize=10
   ```
4. Contact MongoDB Atlas support

## Performance Issues

### Problem: Frontend loads slowly

**Solutions:**
1. Check browser DevTools Network tab
2. Verify API responses are quick
3. Check for large bundle sizes
4. Use `npm run build` to check production size
5. Enable browser caching

### Problem: Backend responds slowly

**Solutions:**
1. Check MongoDB query performance
2. Monitor CPU/memory usage
3. Look for N+1 query problems
4. Add proper database indexes
5. Check network latency

## Still Having Issues?

### Debug Steps

1. **Check all services running:**
   ```bash
   # Terminal 1: Backend logs
   npm run dev:backend
   
   # Terminal 2: Frontend logs
   npm run dev:frontend
   ```

2. **Monitor all output:**
   - Look for error messages
   - Check stack traces
   - Note exact error codes

3. **Verify configuration:**
   ```bash
   # Backend
   cat opsmind-backend-new/.env
   
   # Frontend
   cat opsmind-frontend/.env
   ```

4. **Test connectivity:**
   ```bash
   # Backend is responding
   curl http://localhost:5000/
   
   # Frontend is accessible
   curl http://localhost:3000/
   ```

5. **Check logs:**
   - Browser DevTools Console (F12)
   - Browser DevTools Network tab
   - Terminal output from npm commands

### Getting Help

When seeking help, provide:
- Exact error message
- Steps to reproduce
- Console/log output
- Environment details (OS, Node version, npm version)
- Configuration files (sanitized of secrets)

---

**Still stuck?** See [SETUP.md](SETUP.md) or [COMMANDS.md](COMMANDS.md) for more information.
