# NebulaForge API Documentation

**Version**: 2.1.0 "Advanced Galactic Empire"  
**Build**: 2025.06.18  
**Base URL**: `/api`

## Authentication

All API endpoints require authentication via JWT tokens in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Authentication Endpoints

#### POST /api/auth/register
Register a new user account.

**Request Body**:
```json
{
  "username": "string",
  "email": "string", 
  "password": "string"
}
```

**Response**:
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string"
  }
}
```

#### POST /api/auth/login
Authenticate existing user.

**Request Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

**Response**:
```json
{
  "token": "jwt_token_string",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string"
  }
}
```

#### POST /api/auth/logout
Invalidate current session.

**Response**: `200 OK`

#### GET /api/user
Get current authenticated user information.

**Response**:
```json
{
  "id": 1,
  "username": "string",
  "email": "string",
  "level": 15,
  "experience": 45000,
  "credits": 150000
}
```

## Game Information

#### GET /api/version
Get current game version information.

**Response**:
```json
{
  "version": "2.1.0",
  "build": "2025.06.18",
  "codename": "Advanced Galactic Empire",
  "title": "NebulaForge",
  "description": "Command your galactic empire across the cosmos"
}
```

#### GET /api/game/info
Get comprehensive game information including features and tech stack.

**Response**:
```json
{
  "version": "2.1.0",
  "build": "2025.06.18",
  "codename": "Advanced Galactic Empire",
  "title": "NebulaForge",
  "description": "Command your galactic empire across the cosmos",
  "features": [
    "AI-Powered Companion System",
    "Six Unique Galactic Civilizations",
    "Advanced Strategic Gameplay Mechanics"
  ],
  "techStack": {
    "frontend": "React + TypeScript + Vite",
    "backend": "Express.js + TypeScript",
    "database": "PostgreSQL + Drizzle ORM"
  }
}
```

## Player Management

#### GET /api/players/{playerId}
Get player information and empire status.

**Response**:
```json
{
  "id": 1,
  "username": "GalacticCommander",
  "empireLevel": 15,
  "empireXP": 45000,
  "realmId": 1,
  "universeId": 1,
  "homeWorldId": 1,
  "totalPlayTime": 3600000,
  "premiumCurrency": 1000,
  "subscriptionTier": "PREMIUM"
}
```

#### PUT /api/players/{playerId}
Update player information.

**Request Body**:
```json
{
  "username": "string",
  "email": "string"
}
```

## Empire Management

#### GET /api/empires/{empireId}
Get detailed empire information.

**Response**:
```json
{
  "id": 1,
  "name": "Stellar Dominion",
  "playerId": 1,
  "level": 15,
  "totalPlanets": 5,
  "totalFleets": 12,
  "militaryPower": 150000,
  "economicPower": 200000,
  "researchLevel": 8,
  "allianceId": 3
}
```

#### GET /api/empires/{empireId}/resources
Get current empire resource levels.

**Response**:
```json
{
  "metal": 50000,
  "crystal": 35000,
  "deuterium": 15000,
  "energy": 100000,
  "darkMatter": 500,
  "lastUpdate": "2025-06-18T14:30:00Z"
}
```

## Fleet Management

#### GET /api/fleets/{empireId}
Get all fleets for an empire.

**Response**:
```json
[
  {
    "id": 1,
    "name": "Alpha Squadron",
    "empireId": 1,
    "currentSystemId": 5,
    "ships": {
      "lightFighter": 50,
      "heavyFighter": 25,
      "cruiser": 10,
      "battleship": 5
    },
    "status": "stationed",
    "missionType": null
  }
]
```

#### POST /api/fleets/{empireId}/create
Create a new fleet.

**Request Body**:
```json
{
  "name": "Beta Squadron",
  "ships": {
    "lightFighter": 30,
    "heavyFighter": 15
  }
}
```

#### PUT /api/fleets/{fleetId}/mission
Send fleet on a mission.

**Request Body**:
```json
{
  "targetSystemId": 10,
  "missionType": "attack",
  "departureTime": "2025-06-18T15:00:00Z"
}
```

## Research System

#### GET /api/research/{empireId}
Get current research status and available technologies.

**Response**:
```json
{
  "currentResearch": {
    "techId": "energy_tech_5",
    "startTime": "2025-06-18T12:00:00Z",
    "completionTime": "2025-06-18T18:00:00Z",
    "progress": 75
  },
  "completedTechs": [
    "energy_tech_1",
    "energy_tech_2",
    "weapons_tech_1"
  ],
  "availableTechs": [
    "energy_tech_6",
    "shielding_tech_1"
  ]
}
```

#### POST /api/research/{empireId}/start
Start researching a technology.

**Request Body**:
```json
{
  "techId": "weapons_tech_3",
  "planetId": 1
}
```

## Building System

#### GET /api/buildings/{planetId}
Get all buildings on a planet.

**Response**:
```json
[
  {
    "id": 1,
    "type": "metal_mine",
    "level": 12,
    "planetId": 1,
    "production": 2400,
    "energyConsumption": 800,
    "upgradeInProgress": false
  }
]
```

#### POST /api/buildings/{planetId}/upgrade
Start building upgrade.

**Request Body**:
```json
{
  "buildingType": "crystal_mine",
  "targetLevel": 10
}
```

## Combat System

#### POST /api/combat/simulate
Simulate a battle between fleets.

**Request Body**:
```json
{
  "attackingFleet": {
    "lightFighter": 100,
    "cruiser": 20
  },
  "defendingFleet": {
    "lightFighter": 80,
    "cruiser": 15,
    "defenses": {
      "rocketLauncher": 50
    }
  }
}
```

**Response**:
```json
{
  "result": "attacker_victory",
  "losses": {
    "attacker": {
      "lightFighter": 25,
      "cruiser": 3
    },
    "defender": {
      "lightFighter": 80,
      "cruiser": 15
    }
  },
  "loot": {
    "metal": 15000,
    "crystal": 8000,
    "deuterium": 3000
  }
}
```

## Alliance System

#### GET /api/alliances/{allianceId}
Get alliance information.

**Response**:
```json
{
  "id": 1,
  "name": "Galactic Federation",
  "tag": "GFED",
  "memberCount": 25,
  "totalPower": 5000000,
  "foundedDate": "2025-01-15T00:00:00Z",
  "description": "United for galactic peace"
}
```

#### GET /api/alliances/{allianceId}/members
Get alliance member list.

**Response**:
```json
[
  {
    "playerId": 1,
    "username": "GalacticCommander",
    "rank": "Leader",
    "joinDate": "2025-01-15T00:00:00Z",
    "contributions": 150000
  }
]
```

## Advanced Systems

### AI Companions

#### GET /api/companions/{empireId}
Get empire's AI companions.

**Response**:
```json
[
  {
    "id": 1,
    "name": "ARIA",
    "type": "tactical_advisor",
    "level": 8,
    "experience": 15000,
    "abilities": [
      "fleet_optimization",
      "combat_prediction"
    ],
    "personality": "analytical"
  }
]
```

### Achievements

#### GET /api/achievements/{playerId}
Get player's achievement progress.

**Response**:
```json
{
  "totalAchievements": 45,
  "totalPossible": 300,
  "categories": {
    "military": 15,
    "economic": 12,
    "exploration": 8,
    "diplomatic": 6,
    "research": 4
  },
  "recent": [
    {
      "id": "first_victory",
      "name": "First Victory",
      "description": "Win your first battle",
      "earnedDate": "2025-06-18T10:30:00Z",
      "rarity": "common"
    }
  ]
}
```

### Transcendence System

#### GET /api/transcendence/{empireId}
Get cosmic transcendence progress.

**Response**:
```json
{
  "currentTier": "stellar",
  "progress": 65,
  "nextTier": "galactic",
  "unlockedAbilities": [
    "stellar_manipulation",
    "time_dilation"
  ],
  "transcendencePoints": 850
}
```

## Administrative Endpoints

### Maintenance System

#### GET /api/maintenance/active
Get current maintenance status.

**Response**:
```json
{
  "maintenance": null
}
```

#### GET /api/maintenance/upcoming
Get scheduled maintenance windows.

**Response**:
```json
{
  "maintenance": []
}
```

### Admin Authentication

#### POST /api/admin/auth/login
Administrative login with elevated permissions.

**Request Body**:
```json
{
  "username": "admin_user",
  "password": "admin_password",
  "ipAddress": "192.168.1.1",
  "userAgent": "Mozilla/5.0..."
}
```

**Response**:
```json
{
  "user": {
    "id": 1,
    "username": "admin_user",
    "role": {
      "name": "Administrator",
      "level": 3
    }
  },
  "token": "admin_jwt_token"
}
```

## Error Responses

All endpoints return standard HTTP status codes with JSON error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request parameters",
  "details": "Username must be at least 3 characters long"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "message": "Valid JWT token required"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions",
  "message": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "message": "Empire with ID 999 does not exist"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests, please try again later"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **Authentication**: 5 requests per minute per IP
- **Game Actions**: 100 requests per minute per user
- **Data Queries**: 200 requests per minute per user
- **Admin Actions**: 50 requests per minute per admin user

## WebSocket Events

Real-time updates are delivered via WebSocket connection to `/ws`:

### Connection Events
```javascript
// Connect to WebSocket
const ws = new WebSocket('ws://localhost:5000/ws');

// Authentication
ws.send(JSON.stringify({
  type: 'authenticate',
  token: 'jwt_token'
}));
```

### Game Events
```javascript
// Fleet arrival
{
  "type": "fleet_arrived",
  "fleetId": 1,
  "systemId": 5,
  "timestamp": "2025-06-18T15:30:00Z"
}

// Battle result
{
  "type": "battle_completed",
  "battleId": 123,
  "result": "victory",
  "loot": {
    "metal": 10000,
    "crystal": 5000
  }
}

// Research completed
{
  "type": "research_completed",
  "techId": "energy_tech_5",
  "empireId": 1,
  "timestamp": "2025-06-18T18:00:00Z"
}
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { NebulaForgeClient } from '@nebulaforge/client-sdk';

const client = new NebulaForgeClient({
  baseUrl: 'http://localhost:5000/api',
  token: 'your_jwt_token'
});

// Get empire information
const empire = await client.empires.get(empireId);

// Send fleet on mission
await client.fleets.sendMission(fleetId, {
  targetSystemId: 10,
  missionType: 'attack'
});
```

### Python
```python
from nebulaforge import NebulaForgeClient

client = NebulaForgeClient(
    base_url='http://localhost:5000/api',
    token='your_jwt_token'
)

# Get player achievements
achievements = client.achievements.get_player_achievements(player_id)

# Start research
client.research.start_research(empire_id, tech_id='weapons_tech_3')
```

---

**Note**: This API is under active development. Breaking changes may occur between major versions. Always refer to the latest documentation for current endpoint specifications.