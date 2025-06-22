# UML Diagrams - Space Strategy Game

## System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React UI Components]
        State[TanStack Query State]
        Router[Wouter Routing]
        WS_Client[WebSocket Client]
    end
    
    subgraph "Backend Layer"
        API[Express.js API]
        Auth[JWT Authentication]
        WS_Server[WebSocket Server]
        Storage[Database Storage Layer]
    end
    
    subgraph "Database Layer"
        PG[(PostgreSQL Database)]
        Drizzle[Drizzle ORM]
    end
    
    subgraph "External Services"
        Anthropic[Claude AI]
        Stripe[Payment Processing]
        Email[Email Service]
    end
    
    UI --> API
    State --> API
    WS_Client <--> WS_Server
    API --> Auth
    API --> Storage
    Storage --> Drizzle
    Drizzle --> PG
    API --> Anthropic
    API --> Stripe
    API --> Email
```

## Core Game Systems Class Diagram

```mermaid
classDiagram
    class Player {
        +id: number
        +username: string
        +email: string
        +level: number
        +experience: number
        +kardashevLevel: number
        +reputation: number
        +createdAt: Date
        +getFleets(): Fleet[]
        +getPlanets(): Planet[]
        +getResources(): Resources
    }
    
    class Planet {
        +id: number
        +name: string
        +coordinates: Coordinates
        +type: string
        +size: number
        +temperature: number
        +resources: Resources
        +buildings: Building[]
        +population: number
        +happiness: number
        +upgrade(): void
        +colonize(): void
    }
    
    class Fleet {
        +id: number
        +name: string
        +ships: Ship[]
        +currentPlanet: Planet
        +destination: Planet
        +mission: MissionType
        +arrivalTime: Date
        +status: FleetStatus
        +move(destination: Planet): void
        +attack(target: Fleet): BattleResult
    }
    
    class Ship {
        +id: number
        +type: ShipType
        +name: string
        +attack: number
        +defense: number
        +shield: number
        +speed: number
        +cargo: number
        +fuel: number
        +upgrade(): void
        +repair(): void
    }
    
    class Building {
        +id: number
        +type: BuildingType
        +level: number
        +maxLevel: number
        +production: number
        +energyCost: number
        +upgrade(): void
        +demolish(): void
    }
    
    class Technology {
        +id: number
        +name: string
        +discipline: ScienceDiscipline
        +level: number
        +researchCost: number
        +requirements: Technology[]
        +research(): void
        +isAvailable(): boolean
    }
    
    class AIFaction {
        +id: number
        +name: string
        +class: FactionClass
        +defconLevel: DefconLevel
        +aggression: number
        +diplomacy: number
        +territory: string[]
        +behavior: BehaviorPattern
        +updateDefcon(): void
        +executeStrategy(): void
    }
    
    class Battle {
        +id: number
        +attacker: Fleet
        +defender: Fleet
        +location: Planet
        +rounds: BattleRound[]
        +result: BattleResult
        +startTime: Date
        +endTime: Date
        +simulate(): BattleResult
    }
    
    Player ||--o{ Planet : owns
    Player ||--o{ Fleet : commands
    Player ||--o{ Technology : researches
    Planet ||--o{ Building : contains
    Fleet ||--o{ Ship : contains
    Fleet ||--|| Battle : participates
    AIFaction ||--o{ Fleet : controls
    
    class Resources {
        +metal: number
        +crystal: number
        +deuterium: number
        +energy: number
        +food: number
        +population: number
    }
    
    class Coordinates {
        +galaxy: number
        +system: number
        +position: number
        +x: number
        +y: number
        +z: number
    }
```

## AI Military Strategies System

```mermaid
classDiagram
    class AIMilitaryStrategist {
        -factionId: number
        -currentStrategy: MilitaryStrategy
        +analyzeThreats(): ThreatAnalysis
        +selectStrategy(context): MilitaryStrategy
        +executeTactic(tactic): TacticResult
    }
    
    class MilitaryStrategy {
        +id: string
        +name: string
        +type: StrategyType
        +requirements: Requirements
        +tactics: MilitaryTactic[]
        +effectiveness: Effectiveness
        +riskLevel: number
        +duration: number
    }
    
    class MilitaryTactic {
        +id: string
        +name: string
        +category: TacticCategory
        +action: string
        +parameters: object
        +successRate: number
        +cost: Resources
    }
    
    class AIWarResponseSystem {
        +handleWarDeclaration(faction, target): WarResponse
        +generateWarResponse(strategy, faction): Response
        +getImmediateActions(strategy): string[]
    }
    
    AIMilitaryStrategist ||--|| MilitaryStrategy : uses
    MilitaryStrategy ||--o{ MilitaryTactic : contains
    AIMilitaryStrategist --> AIWarResponseSystem : coordinates
```

## Database Entity Relationship Diagram

```mermaid
erDiagram
    PLAYERS {
        int id PK
        string username UK
        string email UK
        string password_hash
        int level
        decimal experience
        decimal kardashev_level
        timestamp created_at
    }
    
    PLANETS {
        int id PK
        int player_id FK
        string name
        jsonb coordinates
        string type
        int size
        int temperature
        jsonb resources
        int population
        int happiness
    }
    
    FLEETS {
        int id PK
        int player_id FK
        string name
        int current_planet_id FK
        int destination_planet_id FK
        string mission
        timestamp arrival_time
        string status
    }
    
    SHIPS {
        int id PK
        int fleet_id FK
        string type
        string name
        int attack
        int defense
        int shield
        int speed
        int cargo
    }
    
    BUILDINGS {
        int id PK
        int planet_id FK
        string type
        int level
        int max_level
        decimal production
        decimal energy_cost
    }
    
    TECHNOLOGIES {
        int id PK
        int player_id FK
        string name
        string discipline
        int level
        decimal research_cost
        jsonb requirements
    }
    
    AI_FACTIONS {
        int id PK
        string name
        string class
        string defcon_level
        int aggression
        int diplomacy
        jsonb territory
        jsonb behavior
    }
    
    BATTLE_LOGS {
        int id PK
        int attacker_fleet_id FK
        int defender_fleet_id FK
        int planet_id FK
        jsonb rounds
        jsonb result
        timestamp battle_time
    }
    
    KARDASHEV_CIVILIZATIONS {
        int id PK
        int player_id FK
        decimal kardashev_level
        decimal energy_output
        jsonb megastructures
        timestamp last_advancement
    }
    
    STELLAR_PHENOMENA {
        int id PK
        string name
        string type
        jsonb coordinates
        int universe_id
        jsonb properties
    }
    
    PLAYERS ||--o{ PLANETS : owns
    PLAYERS ||--o{ FLEETS : commands
    PLAYERS ||--o{ TECHNOLOGIES : researches
    PLAYERS ||--|| KARDASHEV_CIVILIZATIONS : advances
    PLANETS ||--o{ BUILDINGS : contains
    FLEETS ||--o{ SHIPS : contains
    FLEETS ||--o{ BATTLE_LOGS : participates
    PLANETS ||--o{ BATTLE_LOGS : hosts
```

## WebSocket Communication Flow

```mermaid
sequenceDiagram
    participant Client
    participant WebSocket
    participant GameEngine
    participant Database
    participant AISystem
    
    Client->>WebSocket: Connect
    WebSocket->>GameEngine: Register Player
    
    loop Game Loop
        GameEngine->>AISystem: Update AI Factions
        AISystem->>Database: Update Faction Data
        AISystem->>WebSocket: Broadcast AI Actions
        WebSocket->>Client: Send AI Updates
        
        Client->>WebSocket: Player Action
        WebSocket->>GameEngine: Process Action
        GameEngine->>Database: Update Game State
        GameEngine->>WebSocket: Broadcast Changes
        WebSocket->>Client: Send State Updates
    end
    
    Note over GameEngine: Battle System
    GameEngine->>GameEngine: Calculate Battle
    GameEngine->>Database: Store Battle Results
    GameEngine->>WebSocket: Broadcast Battle Results
    WebSocket->>Client: Real-time Battle Updates
```

## Authentication and Authorization Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant AuthAPI
    participant Database
    participant GameAPI
    
    User->>Frontend: Login Request
    Frontend->>AuthAPI: POST /auth/login
    AuthAPI->>Database: Validate Credentials
    Database-->>AuthAPI: User Data
    AuthAPI->>AuthAPI: Generate JWT
    AuthAPI-->>Frontend: JWT Token
    Frontend->>Frontend: Store Token
    
    Frontend->>GameAPI: Game Request + JWT
    GameAPI->>GameAPI: Validate JWT
    GameAPI->>Database: Fetch Game Data
    Database-->>GameAPI: Game State
    GameAPI-->>Frontend: Game Response
```

## Component Architecture Diagram

```mermaid
graph TB
    subgraph "React Component Tree"
        App[App Component]
        Router[Router Component]
        Game[Game Page]
        Nav[Main Navigation]
        
        subgraph "Game Systems"
            Military[Military Strategies]
            Fleet[Fleet Management]
            Planet[Planet Management]
            Research[Research System]
            Diplo[Diplomacy System]
        end
        
        subgraph "UI Components"
            Cards[Card Components]
            Forms[Form Components]
            Modals[Modal Components]
            Charts[Chart Components]
        end
        
        subgraph "Hooks & State"
            Auth[useAuth Hook]
            Query[React Query]
            WS[useWebSocket Hook]
        end
    end
    
    App --> Router
    Router --> Game
    Game --> Nav
    Game --> Military
    Game --> Fleet
    Game --> Planet
    Game --> Research
    Game --> Diplo
    
    Military --> Cards
    Fleet --> Forms
    Planet --> Modals
    Research --> Charts
    
    Military --> Auth
    Fleet --> Query
    Planet --> WS
```

## AI System Architecture

```mermaid
graph LR
    subgraph "AI Faction System"
        FactionManager[AI Faction Manager]
        Strategist[Military Strategist]
        Behavior[Behavior Engine]
        DEFCON[DEFCON System]
    end
    
    subgraph "AI Decision Making"
        ThreatAnalysis[Threat Analysis]
        StrategySelection[Strategy Selection]
        TacticExecution[Tactic Execution]
        ResponseSystem[War Response]
    end
    
    subgraph "Game Integration"
        GameState[Game State]
        EventSystem[Event System]
        PlayerActions[Player Actions]
        BattleSystem[Battle System]
    end
    
    FactionManager --> Strategist
    Strategist --> Behavior
    Behavior --> DEFCON
    
    Strategist --> ThreatAnalysis
    ThreatAnalysis --> StrategySelection
    StrategySelection --> TacticExecution
    TacticExecution --> ResponseSystem
    
    ResponseSystem --> GameState
    GameState --> EventSystem
    EventSystem --> PlayerActions
    PlayerActions --> BattleSystem
```

## Battle System State Machine

```mermaid
stateDiagram-v2
    [*] --> Preparation
    Preparation --> Formation : Fleet Deployment
    Formation --> Combat : Battle Start
    Combat --> Calculation : Process Round
    Calculation --> Combat : Continue Battle
    Calculation --> Resolution : Battle End
    Resolution --> Aftermath : Calculate Results
    Aftermath --> [*] : Battle Complete
    
    state Combat {
        [*] --> AttackerTurn
        AttackerTurn --> DefenderTurn : Turn Complete
        DefenderTurn --> RoundEnd : Turn Complete
        RoundEnd --> AttackerTurn : Next Round
        RoundEnd --> [*] : Battle Over
    }
```

## Kardashev Civilization Advancement

```mermaid
graph TD
    Start[Type 0 Civilization] --> Type1[Type I - Planetary]
    Type1 --> Type2[Type II - Stellar]
    Type2 --> Type3[Type III - Galactic]
    Type3 --> Type4[Type IV - Universal]
    
    Type1 --> PlanetaryGrid[Planetary Energy Grid]
    Type2 --> DysonSphere[Dyson Sphere]
    Type3 --> GalacticNetwork[Galactic Energy Network]
    Type4 --> UniversalControl[Universal Energy Control]
    
    subgraph "Megastructures"
        PlanetaryGrid
        DysonSphere
        GalacticNetwork
        UniversalControl
    end
    
    subgraph "Research Requirements"
        Energy[Energy Technology]
        Materials[Advanced Materials]
        Computing[Quantum Computing]
        Physics[Theoretical Physics]
    end
    
    Type1 --> Energy
    Type2 --> Materials
    Type3 --> Computing
    Type4 --> Physics
```

## Data Flow Architecture

```mermaid
graph LR
    subgraph "Client Side"
        UserAction[User Action]
        Component[React Component]
        QueryCache[Query Cache]
    end
    
    subgraph "Network Layer"
        HTTP[HTTP Request]
        WebSocket[WebSocket]
    end
    
    subgraph "Server Side"
        Router[Express Router]
        Controller[Route Controller]
        Service[Business Logic]
        Storage[Storage Layer]
    end
    
    subgraph "Database"
        ORM[Drizzle ORM]
        PostgreSQL[(PostgreSQL)]
    end
    
    UserAction --> Component
    Component --> QueryCache
    QueryCache --> HTTP
    HTTP --> Router
    Router --> Controller
    Controller --> Service
    Service --> Storage
    Storage --> ORM
    ORM --> PostgreSQL
    
    PostgreSQL --> ORM
    ORM --> Storage
    Storage --> Service
    Service --> Controller
    Controller --> WebSocket
    WebSocket --> Component
```

## Game State Management

```mermaid
stateDiagram-v2
    [*] --> Initialization
    Initialization --> MainMenu : System Ready
    MainMenu --> GameLobby : Join Game
    GameLobby --> ActiveGame : Start Game
    
    state ActiveGame {
        [*] --> Planning
        Planning --> Production : Build Phase
        Production --> Research : Tech Phase
        Research --> Military : Combat Phase
        Military --> Diplomacy : Negotiation Phase
        Diplomacy --> Planning : Next Turn
        
        Planning --> Paused : Pause Game
        Paused --> Planning : Resume Game
    }
    
    ActiveGame --> GameEnd : Victory/Defeat
    GameEnd --> MainMenu : Return to Menu
    GameEnd --> [*] : Exit Game
```