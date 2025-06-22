# Raspberry Pi Service Setup Guide

## Overview

This guide covers deploying the space strategy game as a service on Raspberry Pi devices, enabling distributed hosting, private server instances, and edge computing capabilities for reduced latency gaming experiences.

---

## Hardware Requirements

### Minimum Specifications
- **Raspberry Pi 4 Model B** (4GB RAM minimum)
- **32GB Class 10 MicroSD Card** (64GB recommended)
- **Stable internet connection** (10
-
- Mbps+ upload)
- **Power supply**: Official Pi 4 USB-C charger (5.1V/3A)
- **Cooling**: Heat sinks or active cooling recommended

### Recommended Specifications
- **Raspberry Pi 4 Model B** (8GB RAM)
- **128GB MicroSD Card** (SanDisk Extreme Pro)
- **Gigabit ethernet connection**
- **External SSD** via USB 3.0 for database storage
- **Case with active cooling fan**

### Performance Expectations
- **Player capacity**: 50-100 concurrent users per Pi 4 (4GB)
- **Response time**: <50ms for local region players
- **Database operations**: 100-500 queries/second
- **WebSocket connections**: 200+ simultaneous connections

---

## Operating System Setup

### Step 1: Install Raspberry Pi OS
```bash
# Download Raspberry Pi Imager
# Flash 64-bit Raspberry Pi OS (Lite recommended for server use)
# Enable SSH during imaging process
```

### Step 2: Initial Configuration
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Configure memory split (reduce GPU memory for headless operation)
sudo raspi-config
# Advanced Options > Memory Split > Set to 16

# Enable container features
echo 'cgroup_enable=cpuset cgroup_enable=memory cgroup_memory=1' | sudo tee -a /boot/cmdline.txt

# Reboot to apply changes
sudo reboot
```

### Step 3: Security Hardening
```bash
# Change default password
passwd

# Configure firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 5000/tcp  # Game server port
sudo ufw allow 5432/tcp  # PostgreSQL port (if external access needed)

# Disable unnecessary services
sudo systemctl disable bluetooth
sudo systemctl disable avahi-daemon
sudo systemctl disable triggerhappy
```

---

## Software Installation

### Step 1: Install Node.js
```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version
```

### Step 2: Install PostgreSQL
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Configure PostgreSQL
sudo -u postgres psql
CREATE DATABASE ogame_universe;
CREATE USER ogame_user WITH ENCRYPTED PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ogame_universe TO ogame_user;
\q

# Configure PostgreSQL for network access (if needed)
sudo nano /etc/postgresql/13/main/postgresql.conf
# Uncomment and modify: listen_addresses = '*'

sudo nano /etc/postgresql/13/main/pg_hba.conf
# Add: host all all 0.0.0.0/0 md5

sudo systemctl restart postgresql
```

### Step 3: Install Application Dependencies
```bash
# Install PM2 for process management
sudo npm install -g pm2

# Install additional system dependencies
sudo apt install git build-essential python3-pip -y
```

---

## Application Deployment

### Step 1: Clone and Setup Application
```bash
# Create application directory
sudo mkdir -p /opt/ogame-server
sudo chown pi:pi /opt/ogame-server
cd /opt/ogame-server

# Clone repository (replace with your repository URL)
git clone https://github.com/your-username/ogame-server.git .

# Install dependencies
npm install

# Build application
npm run build
```

### Step 2: Environment Configuration
```bash
# Create environment file
nano .env
```

Add the following configuration:
```env
NODE_ENV=production
DATABASE_URL=postgresql://ogame_user:your_secure_password@localhost:5432/ogame_universe
OPENAI_API_KEY=your_openai_api_key
PORT=5000
HOST=0.0.0.0

# Raspberry Pi specific optimizations
UV_THREADPOOL_SIZE=8
NODE_OPTIONS="--max-old-space-size=3072"

# Game server configuration
MAX_CONCURRENT_USERS=100
ENABLE_FEDERATION=true
FEDERATION_KEY=your_federation_key
```

### Step 3: Database Initialization
```bash
# Run database migrations
npm run db:push

# Initialize game data
npm run init:universe
npm run init:factions
```

---

## Service Configuration

### Step 1: Create Systemd Service
```bash
sudo nano /etc/systemd/system/ogame-server.service
```

Add the following service configuration:
```ini
[Unit]
Description=OGame Universe Server
After=network.target postgresql.service
Requires=postgresql.service

[Service]
Type=simple
User=pi
Group=pi
WorkingDirectory=/opt/ogame-server
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=ogame-server

# Resource limits
LimitNOFILE=65536
LimitMEMLOCK=infinity

# Security settings
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=strict
ReadWritePaths=/opt/ogame-server

[Install]
WantedBy=multi-user.target
```

### Step 2: Enable and Start Service
```bash
# Reload systemd configuration
sudo systemctl daemon-reload

# Enable service for auto-start
sudo systemctl enable ogame-server

# Start the service
sudo systemctl start ogame-server

# Check service status
sudo systemctl status ogame-server

# View logs
sudo journalctl -u ogame-server -f
```

---

## Performance Optimization

### Step 1: System Optimization
```bash
# Optimize kernel parameters
sudo nano /etc/sysctl.conf
```

Add the following optimizations:
```conf
# Network optimizations
net.core.somaxconn = 1024
net.core.netdev_max_backlog = 5000
net.core.rmem_default = 262144
net.core.rmem_max = 16777216
net.core.wmem_default = 262144
net.core.wmem_max = 16777216

# PostgreSQL optimizations
vm.swappiness = 10
vm.dirty_ratio = 15
vm.dirty_background_ratio = 5

# File system optimizations
fs.file-max = 65536
```

Apply changes:
```bash
sudo sysctl -p
```

### Step 2: PostgreSQL Tuning
```bash
sudo nano /etc/postgresql/13/main/postgresql.conf
```

Add Raspberry Pi specific optimizations:
```conf
# Memory settings (for 4GB Pi)
shared_buffers = 512MB
effective_cache_size = 2GB
work_mem = 8MB
maintenance_work_mem = 128MB

# Connection settings
max_connections = 150
max_prepared_transactions = 50

# Performance settings
random_page_cost = 1.1
effective_io_concurrency = 200
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

### Step 3: Application Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs -y

# Setup PM2 monitoring (if using PM2)
pm2 install pm2-server-monit
pm2 monit
```

---

## Federation and Clustering

### Multi-Pi Cluster Setup
For handling larger player bases, multiple Raspberry Pis can work together:

### Step 1: Load Balancer Configuration
```bash
# Install HAProxy on primary Pi
sudo apt install haproxy -y

sudo nano /etc/haproxy/haproxy.cfg
```

Add load balancer configuration:
```conf
global
    daemon
    maxconn 2048

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms

frontend ogame_frontend
    bind *:80
    default_backend ogame_servers

backend ogame_servers
    balance roundrobin
    server pi1 192.168.1.101:5000 check
    server pi2 192.168.1.102:5000 check
    server pi3 192.168.1.103:5000 check
```

### Step 2: Database Clustering
```bash
# Setup PostgreSQL streaming replication
# On primary database server
sudo nano /etc/postgresql/13/main/postgresql.conf
```

Configure primary database:
```conf
# Replication settings
wal_level = replica
max_wal_senders = 3
max_replication_slots = 3
synchronous_commit = on
```

### Step 3: Session Synchronization
Configure Redis for session sharing:
```bash
# Install Redis
sudo apt install redis-server -y

# Configure Redis for network access
sudo nano /etc/redis/redis.conf
# Modify: bind 0.0.0.0
# Set password: requirepass your_redis_password

sudo systemctl restart redis
```

---

## Backup and Recovery

### Automated Backup Script
```bash
#!/bin/bash
# /opt/ogame-server/scripts/backup.sh

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="ogame_universe"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
pg_dump -U ogame_user -h localhost $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Application backup
tar -czf $BACKUP_DIR/app_backup_$DATE.tar.gz -C /opt/ogame-server .

# Remove backups older than 7 days
find $BACKUP_DIR -name "*.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

### Setup Backup Cron Job
```bash
# Make script executable
chmod +x /opt/ogame-server/scripts/backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /opt/ogame-server/scripts/backup.sh
```

---

## Monitoring and Maintenance

### System Monitoring
```bash
# Create monitoring script
nano /opt/ogame-server/scripts/monitor.sh
```

```bash
#!/bin/bash
# System monitoring script

# Check service status
if ! systemctl is-active --quiet ogame-server; then
    echo "$(date): OGame server is down, attempting restart"
    systemctl restart ogame-server
fi

# Check database connectivity
if ! pg_isready -h localhost -p 5432 -U ogame_user; then
    echo "$(date): Database connectivity issue"
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 85 ]; then
    echo "$(date): Warning: Disk usage is ${DISK_USAGE}%"
fi

# Check memory usage
MEM_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $MEM_USAGE -gt 90 ]; then
    echo "$(date): Warning: Memory usage is ${MEM_USAGE}%"
fi
```

### Log Rotation
```bash
sudo nano /etc/logrotate.d/ogame-server
```

```conf
/var/log/ogame-server/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    copytruncate
}
```

---

## Troubleshooting

### Common Issues

**1. Service Won't Start**
```bash
# Check service logs
sudo journalctl -u ogame-server -n 50

# Check port availability
sudo netstat -tlnp | grep :5000

# Verify Node.js installation
node --version
npm --version
```

**2. Database Connection Issues**
```bash
# Test database connection
psql -U ogame_user -h localhost -d ogame_universe

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log

# Restart PostgreSQL
sudo systemctl restart postgresql
```

**3. Performance Issues**
```bash
# Check system resources
htop
iotop
free -h

# Monitor network connections
ss -tuln

# Check application logs
sudo journalctl -u ogame-server -f
```

**4. Memory Issues**
```bash
# Check for memory leaks
sudo systemctl status ogame-server
ps aux | grep node

# Restart service if needed
sudo systemctl restart ogame-server
```

---

## Security Considerations

### Network Security
- Use VPN for administration access
- Configure fail2ban for SSH brute force protection
- Regular security updates: `sudo apt update && sudo apt upgrade`
- Monitor network traffic for unusual patterns

### Application Security
- Regular dependency updates: `npm audit fix`
- Environment variable protection
- Database user privilege minimization
- API rate limiting configuration

### Physical Security
- Secure physical access to Pi devices
- UPS power backup for critical instances
- Temperature monitoring and cooling
- Secure storage of backup media

---

## Scaling and Advanced Deployment

### Docker Deployment (Alternative)
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
sudo usermod -aG docker pi

# Create Dockerfile for the application
nano Dockerfile
```

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server/index.js"]
```

### Kubernetes Deployment
For advanced users running multiple Pi clusters:
```yaml
# ogame-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ogame-server
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ogame-server
  template:
    metadata:
      labels:
        app: ogame-server
    spec:
      containers:
      - name: ogame-server
        image: ogame-server:latest
        ports:
        - containerPort: 5000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: ogame-secrets
              key: database-url
```

This comprehensive guide provides everything needed to deploy and maintain the space strategy game on Raspberry Pi infrastructure, from single-device setups to distributed clusters.