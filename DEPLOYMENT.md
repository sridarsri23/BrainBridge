# 🚀 Deployment Guide for BrainBridge

## Railway Deployment Steps

### Option 1: Nixpacks (Recommended)
1. Go to [railway.app](https://railway.app) and sign up
2. Connect your GitHub repository
3. Railway will auto-detect the project structure using nixpacks

### Option 2: Docker (Alternative)
If nixpacks fails, Railway can also use the Dockerfile:
1. In Railway dashboard, go to your service settings
2. Under "Build & Deploy", select "Dockerfile" as the build method
3. Railway will use the provided Dockerfile

### 2. Add PostgreSQL Database
1. In your Railway project dashboard, click "New Service"
2. Select "Database" → "PostgreSQL"
3. Railway will create a PostgreSQL instance
4. Copy the `DATABASE_URL` from the PostgreSQL service variables

### 3. Configure Environment Variables
In your main service, add these environment variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
OPENAI_API_KEY=your_openai_api_key_here
SECRET_KEY=your_secret_key_for_jwt_tokens
```

### 4. Deploy
1. Railway will automatically deploy when you push to GitHub
2. The build process will:
   - Install Python dependencies from `requirements.txt`
   - Install Node.js dependencies from `package.json`
   - Build the React frontend
   - Start the FastAPI server

## Troubleshooting

### Issue: "uvicorn: command not found"
**Solution**: The configuration files have been updated to use `python -m uvicorn` instead of just `uvicorn`.

### Issue: Nixpacks build fails with "undefined variable 'npm'"
**Solution**: 
1. Try using the Dockerfile instead: In Railway dashboard → Service Settings → Build & Deploy → Select "Dockerfile"
2. Or try the simplified nixpacks configuration in `.nixpacks` file

### Issue: Health check fails after successful build
**Solution**: 
1. Check Railway logs for startup errors
2. The health check path has been changed to `/` (simpler endpoint)
3. Database connection issues won't crash the app anymore
4. The PORT environment variable issue has been fixed with `start_server.py`

### Issue: "Invalid value for '--port': '$PORT' is not a valid integer"
**Solution**: 
1. The startup script now properly handles the PORT environment variable
2. Uses `start_server.py` which correctly reads the PORT from environment
3. Falls back to port 8000 if PORT is not set

### Issue: Only backend running, no frontend
**Solution**: 
1. Frontend build process has been improved with better error handling
2. Static file serving now includes debugging information
3. The app will serve frontend if built, or fallback to API response
4. Check Railway logs for frontend build status

### Issue: Database connection fails
**Solution**: 
1. Make sure `DATABASE_URL` is set correctly
2. Check that the PostgreSQL service is running
3. Verify the database URL format: `postgresql://user:pass@host:port/dbname`

### Issue: Frontend not building
**Solution**:
1. Check that all Node.js dependencies are in `package.json`
2. Verify the build script in `package.json` is correct
3. Check the build logs in Railway dashboard

### Issue: Environment variables not loading
**Solution**:
1. Make sure all required environment variables are set in Railway
2. Check that `.env` files are not being used (they won't work in production)
3. Verify variable names match what the code expects

## Files Added for Deployment

- `requirements.txt` - Python dependencies
- `Procfile` - Tells Railway how to start the app
- `runtime.txt` - Specifies Python version
- `railway.json` - Railway-specific configuration
- `nixpacks.toml` - Build configuration (Nixpacks)
- `.nixpacks` - Alternative build configuration
- `Dockerfile` - Docker-based deployment
- `start_server.py` - Python startup script with proper PORT handling
- `railway-debug.py` - Debug script for troubleshooting
- `wsgi.py` - Alternative entry point

## Health Check

The application includes a health check endpoint at `/api/health` that Railway will use to verify the deployment is working.

## Manual Deployment Test

To test locally before deploying:

```bash
# Install dependencies
pip install -r requirements.txt
npm install

# Build frontend
npm run build

# Start server
python -m uvicorn server.main:app --host 0.0.0.0 --port 8000
```

Visit `http://localhost:8000` to verify everything works.
