# Opsmind AI - SOP and Knowledge Management Platform

A full-stack application for managing Standard Operating Procedures (SOPs) and knowledge management with AI-powered assistance.

## Project Structure

```
opsmind-ai/
├── opsmind-backend-new/   # Express.js backend
├── opsmind-frontend/       # React frontend
├── package.json            # Root package configuration
└── setup.ps1              # Windows setup script
```

## Prerequisites

- **Node.js** >= 16.0.0
- **npm** >= 8.0.0
- **MongoDB** (Atlas or local instance)
- **Gemini API Key** (for AI features)

## Quick Setup

### Windows (PowerShell)

```powershell
# Run the setup script
.\setup.ps1
```

### Manual Setup (All Platforms)

```bash
# 1. Install root dependencies
npm install

# 2. Install backend dependencies
cd opsmind-backend-new
npm install
cd ..

# 3. Install frontend dependencies
cd opsmind-frontend
npm install
cd ..
```

## Configuration

### Backend Setup

1. Navigate to `opsmind-backend-new/` directory
2. Update `.env` file with your credentials:

```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/OpsmindDB?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key_here
NODE_ENV=development
```

**Important**: 
- Get MongoDB URI from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Frontend Setup

1. Navigate to `opsmind-frontend/` directory
2. The `.env` file should already have the correct API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Option 1: Separate Terminals (Recommended for Development)

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

**Terminal 3 (Optional) - Monitor logs:**
```bash
cd opsmind-backend-new
npm run dev
```

### Option 2: Individual Commands

**Backend:**
```bash
cd opsmind-backend-new
npm run dev
# Backend will run on http://localhost:5000
```

**Frontend:**
```bash
cd opsmind-frontend
npm run dev
# Frontend will run on http://localhost:3000
```

## Access the Application

Once both services are running:

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

## API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### SOP Management (`/api/sop`)
- `GET /api/sop` - Get all SOPs
- `POST /api/sop` - Create new SOP
- `GET /api/sop/:id` - Get specific SOP
- `PUT /api/sop/:id` - Update SOP
- `DELETE /api/sop/:id` - Delete SOP

### Ask Agent (`/api/ask`)
- `POST /api/ask` - Send query to AI agent
- `GET /api/ask/stream` - Stream AI responses

### Protected Routes
- `GET /api/test` - Test protected route
- `GET /api/admin` - Admin-only route

## Technologies

### Backend
- **Express.js** - Web framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Google Generative AI** - AI features
- **Multer** - File uploads

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Vite** - Build tool
- **Vanilla CSS** - Styling

## Project Features

- 👤 User authentication (Register/Login)
- 📄 SOP management and versioning
- 🤖 AI-powered ask agent
- 🔒 Role-based access control
- 📤 File upload support
- 🔐 Protected API routes

## Troubleshooting

### MongoDB Connection Issues
- Verify your MongoDB URI in `.env`
- Check MongoDB Atlas network access whitelist
- Ensure your IP address is allowed

### Port Already in Use
```bash
# Kill process using port 5000 (backend)
npx kill-port 5000

# Kill process using port 3000 (frontend)
npx kill-port 3000
```

### CORS Errors
- Verify frontend is running on `http://localhost:3000`
- Verify backend CORS is configured correctly in `server.js`
- Check that API proxy is configured in `vite.config.js`

### Missing Dependencies
```bash
# Clear node_modules and reinstall
rm -r node_modules package-lock.json
npm install
```

## Available npm Scripts

### Root Level
```bash
npm run dev:backend    # Start backend with hot reload
npm run dev:frontend   # Start frontend with hot reload
npm run build         # Build frontend for production
npm run preview       # Preview production build
npm run install:all   # Install all dependencies at once
```

### Backend
```bash
cd opsmind-backend-new
npm run start         # Start backend
npm run dev          # Start with nodemon
```

### Frontend
```bash
cd opsmind-frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview build
```

## Development Workflow

1. **Backend Development**: Changes auto-reload via nodemon
2. **Frontend Development**: Changes auto-reload via Vite HMR
3. **Database**: All changes persist in MongoDB

## Environment Variables Reference

### Backend (.env)
| Variable | Purpose | Example |
|----------|---------|---------|
| PORT | Server port | 5000 |
| MONGO_URI | MongoDB connection | mongodb+srv://user:pass@cluster... |
| JWT_SECRET | JWT signing key | your_secret_key |
| GEMINI_API_KEY | Google AI API key | AIzaSy... |
| NODE_ENV | Environment | development |

### Frontend (.env)
| Variable | Purpose | Example |
|----------|---------|---------|
| VITE_API_URL | Backend API URL | http://localhost:5000/api |

## Building for Production

```bash
# Build frontend
npm run build

# Backend is ready for production as-is
# Deploy using your preferred hosting service
```

## Support & Debugging

- Check terminal output for error messages
- Review browser DevTools (F12) for frontend errors
- Monitor backend logs while making requests
- Verify all `.env` variables are set correctly

## License

ISC

## Next Steps

1. ✅ Complete the setup as described above
2. 📝 Update `.env` with your credentials
3. 🚀 Start both services
4. 🌐 Access the application
5. 🔐 Create your account and explore!

---

**Happy Building! 🚀**
