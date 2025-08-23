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
1. **Removed conflicting `railway.toml`** - This was causing configuration conflicts
2. **Updated health check timeout** - Reduced to 60 seconds with 10-second intervals
3. **Added health check debugging** - The endpoint now logs when called
4. **Alternative: Use `railway-no-healthcheck.json`** - If health checks still fail, rename this to `railway.json`

### Issue: Server starts but Railway can't reach health endpoint
**Solution**:
1. Check if Railway is using the correct configuration file
2. Verify the health endpoint is accessible at `/api/health`
3. Try the no-healthcheck configuration if needed
4. Check Railway logs for health check attempts

### Issue: Health check timing - server not ready when Railway checks
**Solution**:
1. **Extended health check timeout** - Increased to 120 seconds with 30-second intervals
2. **Made database init non-blocking** - Faster startup, database init runs in background
3. **Simplified health check** - No database dependencies, returns immediately
4. **Alternative: Use `railway-no-healthcheck.json`** - If timing issues persist, rename to `railway.json`

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
4. **Railway DATABASE_URL fix**: The code now automatically converts `postgres://` to `postgresql://`
5. **Database tables**: The app will automatically create tables on startup
6. **Test connection**: Use `python test_db_connection.py` to test database connectivity

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
