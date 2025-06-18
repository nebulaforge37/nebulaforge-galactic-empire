# NebulaForge Deployment Guide

**Version**: 2.1.0 "Advanced Galactic Empire"  
**Build**: 2025.06.18  
**Status**: Production Ready

## Quick Deployment Options

### Replit Deployment (Recommended)
The simplest deployment method with built-in PostgreSQL database and automatic scaling.

1. **Prepare for Deployment**:
   ```bash
   # Ensure all dependencies are installed
   npm install
   
   # Push database schema
   npm run db:push
   ```

2. **Deploy via Replit**:
   - Click the "Deploy" button in Replit interface
   - Configure custom domain (optional)
   - Enable autoscaling for production traffic

3. **Environment Variables**:
   ```env
   NODE_ENV=production
   DATABASE_URL=<automatically_configured>
   JWT_SECRET=<generate_secure_secret>
   OPENAI_API_KEY=<your_openai_key>
   ```

### Docker Deployment

1. **Build Docker Image**:
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   
   COPY . .
   RUN npm run build
   
   EXPOSE 5000
   CMD ["npm", "start"]
   ```

2. **Docker Compose Setup**:
   ```yaml
   version: '3.8'
   services:
     nebulaforge:
       build: .
       ports:
         - "5000:5000"
       environment:
         - NODE_ENV=production
         - DATABASE_URL=postgresql://user:pass@db:5432/nebulaforge
       depends_on:
         - db
     
     db:
       image: postgres:15
       environment:
         - POSTGRES_DB=nebulaforge
         - POSTGRES_USER=user
         - POSTGRES_PASSWORD=password
       volumes:
         - postgres_data:/var/lib/postgresql/data
   
   volumes:
     postgres_data:
   ```

3. **Deploy with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

### Cloud Platform Deployment

#### Vercel Deployment
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Configure vercel.json**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server/index.ts",
         "use": "@vercel/node"
       },
       {
         "src": "client/dist/**",
         "use": "@vercel/static"
       }
     ],
     "routes": [
       {
         "src": "/api/(.*)",
         "dest": "/server/index.ts"
       },
       {
         "src": "/(.*)",
         "dest": "/client/dist/$1"
       }
     ]
   }
   ```

3. **Deploy**:
   ```bash
   vercel --prod
   ```

#### Railway Deployment
1. **Connect Railway CLI**:
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Create Railway Project**:
   ```bash
   railway init
   railway add postgresql
   ```

3. **Configure Environment**:
   ```bash
   railway variables set NODE_ENV=production
   railway variables set JWT_SECRET=your_secure_secret
   ```

4. **Deploy**:
   ```bash
   railway up
   ```

#### AWS EC2 Deployment
1. **Launch EC2 Instance**:
   - Choose Ubuntu 22.04 LTS
   - Configure security groups (ports 22, 80, 443, 5000)
   - Generate key pair for SSH access

2. **Server Setup**:
   ```bash
   # Connect to instance
   ssh -i your-key.pem ubuntu@your-instance-ip
   
   # Install Node.js and PostgreSQL
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs postgresql postgresql-contrib nginx
   
   # Clone and setup application
   git clone <your-repo>
   cd nebulaforge
   npm install
   npm run build
   ```

3. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. **SSL with Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

## Database Configuration

### PostgreSQL Setup
1. **Create Database**:
   ```sql
   CREATE DATABASE nebulaforge;
   CREATE USER nebulaforge_user WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE nebulaforge TO nebulaforge_user;
   ```

2. **Connection String**:
   ```
   DATABASE_URL=postgresql://nebulaforge_user:secure_password@localhost:5432/nebulaforge
   ```

3. **Initialize Schema**:
   ```bash
   npm run db:push
   ```

### Database Migrations
```bash
# Generate migration
npm run db:generate

# Push schema changes
npm run db:push

# Reset database (development only)
npm run db:reset
```

## Security Configuration

### JWT Configuration
```javascript
// Generate secure JWT secret
const crypto = require('crypto');
const jwtSecret = crypto.randomBytes(64).toString('hex');
```

### Environment Variables
```env
# Required
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/db
JWT_SECRET=your_64_character_secret

# Optional
OPENAI_API_KEY=sk-your_openai_key
PORT=5000
CORS_ORIGIN=https://your-domain.com
```

### Security Headers
```javascript
// Express security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## Performance Optimization

### Database Optimization
```sql
-- Create indexes for common queries
CREATE INDEX idx_players_username ON players(username);
CREATE INDEX idx_empires_player_id ON empires(player_id);
CREATE INDEX idx_fleets_empire_id ON fleets(empire_id);
CREATE INDEX idx_buildings_planet_id ON buildings(planet_id);
```

### Caching Strategy
```javascript
// Redis configuration
const redis = require('redis');
const client = redis.createClient({
  url: process.env.REDIS_URL
});

// Cache frequently accessed data
app.get('/api/empires/:id', async (req, res) => {
  const cacheKey = `empire:${req.params.id}`;
  const cached = await client.get(cacheKey);
  
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  const empire = await getEmpire(req.params.id);
  await client.setex(cacheKey, 300, JSON.stringify(empire));
  res.json(empire);
});
```

### CDN Configuration
```javascript
// Static asset optimization
app.use('/assets', express.static('public', {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));
```

## Monitoring and Logging

### Application Monitoring
```javascript
// Winston logging configuration
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Check Endpoint
```javascript
app.get('/health', async (req, res) => {
  try {
    // Check database connection
    await db.raw('SELECT 1');
    
    // Check Redis connection
    await client.ping();
    
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});
```

### Performance Metrics
```javascript
// Prometheus metrics
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  
  next();
});
```

## Backup and Recovery

### Database Backup
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="nebulaforge_backup_$DATE.sql"

pg_dump -h localhost -U nebulaforge_user -d nebulaforge > $BACKUP_FILE
gzip $BACKUP_FILE

# Upload to cloud storage
aws s3 cp $BACKUP_FILE.gz s3://your-backup-bucket/database/
```

### Restore Procedure
```bash
# Restore from backup
gunzip nebulaforge_backup_20250618_120000.sql.gz
psql -h localhost -U nebulaforge_user -d nebulaforge < nebulaforge_backup_20250618_120000.sql
```

## Load Balancing

### Nginx Load Balancer
```nginx
upstream nebulaforge_backend {
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}

server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://nebulaforge_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    location /ws {
        proxy_pass http://nebulaforge_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### PM2 Process Management
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'nebulaforge',
    script: './server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log'
  }]
};
```

```bash
# Deploy with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   ```bash
   # Check PostgreSQL status
   sudo systemctl status postgresql
   
   # Test connection
   psql -h localhost -U nebulaforge_user -d nebulaforge
   ```

2. **Memory Issues**:
   ```bash
   # Monitor memory usage
   top -p $(pgrep node)
   
   # Increase Node.js memory limit
   node --max-old-space-size=4096 server/index.js
   ```

3. **WebSocket Connection Issues**:
   ```javascript
   // Check WebSocket configuration
   const wss = new WebSocketServer({ 
     server: httpServer, 
     path: '/ws',
     clientTracking: true,
     maxPayload: 1024 * 1024
   });
   ```

### Debugging Tools
```bash
# View application logs
pm2 logs nebulaforge

# Monitor performance
pm2 monit

# Debug with Node.js inspector
node --inspect server/index.js
```

## Production Checklist

### Pre-Deployment
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] Security headers configured
- [ ] Backup procedures tested
- [ ] Monitoring systems active

### Post-Deployment
- [ ] Health checks passing
- [ ] WebSocket connections working
- [ ] Authentication system functional
- [ ] Database queries optimized
- [ ] CDN properly configured
- [ ] Error tracking operational

### Security Verification
- [ ] JWT secrets are secure and unique
- [ ] Database credentials are protected
- [ ] API rate limiting is active
- [ ] Input validation is comprehensive
- [ ] HTTPS is enforced
- [ ] Security headers are present

---

**Deployment Support**: For assistance with deployment issues, refer to the troubleshooting section or contact the development team with detailed error logs and environment information.