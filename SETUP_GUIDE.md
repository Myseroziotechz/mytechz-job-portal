# MongoDB Connection & Setup Guide

## Issues Fixed ✅

1. **MongoDB URI** - Removed spaces from username and added database name
2. **Server.js** - Removed CommonJS `require` statement (incompatible with ES modules)
3. **Duplicate code** - Fixed duplicate if statement
4. **Better error handling** - Added detailed MongoDB connection logging

## Quick Start

### 1. Start Backend Server

```bash
cd server
npm install
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0.dt63zvk.mongodb.net
Server running on port 5010
```

### 2. Start Frontend Client

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

You should see:
```
VITE ready in XXX ms
Local: http://localhost:5173/
```

## MongoDB Connection String

Your `.env` file now has the corrected MongoDB URI:

```
MONGO_URI=mongodb+srv://rajaparimala000:RaviKumaraHS%4018@cluster0.dt63zvk.mongodb.net/mytechz?retryWrites=true&w=majority&appName=Cluster0
```

**Note:** If you still get connection errors, verify:
- Username: `rajaparimala000`
- Password: `RaviKumaraHS@18` (URL encoded as `RaviKumaraHS%4018`)
- Database: `mytechz`

## Troubleshooting

### If MongoDB still fails to connect:

1. **Check MongoDB Atlas**:
   - Go to https://cloud.mongodb.com
   - Verify your cluster is running
   - Check Network Access - Add `0.0.0.0/0` to allow all IPs (for testing)
   - Check Database Access - Verify user credentials

2. **Test connection manually**:
   ```bash
   cd server
   node -e "require('dotenv').config(); console.log(process.env.MONGO_URI)"
   ```

3. **Check if username/password changed**:
   - If credentials are different, update the MONGO_URI in `server/.env`
   - Format: `mongodb+srv://USERNAME:PASSWORD@cluster0.dt63zvk.mongodb.net/DATABASE_NAME`

### If frontend can't connect to backend:

1. Verify backend is running on port 5010
2. Check `client/.env` has: `VITE_API_BASE_URL=http://localhost:5010`
3. Check browser console for CORS errors

## Environment Variables

### Server (.env)
- `MONGO_URI` - MongoDB connection string
- `PORT` - Server port (5010)
- `JWT_SECRET` - Secret for JWT tokens
- `CLIENT_URL` - Frontend URL for CORS

### Client (.env)
- `VITE_API_BASE_URL` - Backend API URL (http://localhost:5010)

## Production Deployment

For production, update:
- `server/.env`: `CLIENT_URL=https://mytechz.in`
- `client/.env`: `VITE_API_BASE_URL=https://api.mytechz.in`
