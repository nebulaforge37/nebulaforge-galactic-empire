import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from "./init-db";
import { spawn } from "child_process";
import path from "path";
import { initializeUniverses } from "./init-universe";
import { gameSeedSystem } from "./seed-system";
import { npcAi } from "./npc-ai";
import { initializeTalentSystem } from "./init-talents";
import { initializeMessagingSystem } from "./init-messaging";
import { initializeMaterialsSystem } from "./init-materials";
import { initializeStoryModeSystem } from "./init-story-mode";
import { initializeBlueprintSystem } from "./init-blueprint-system";
import { initializeCombatSystem } from "./init-combat-system";
import { initializeHomeworldProtection } from "./init-homeworld-protection";
import { buildingsInfrastructure } from "./init-buildings-infrastructure";
import { initializeGameResearch } from "./init-game-research";
import { setupGameResearchRoutes } from "./routes-game-research";
import { initializeEmpireWorldAgeSystem } from "./init-empire-world-age";
import { diplomaticSystem } from "./init-diplomatic-system";
import { tradeEconomicsSystem } from "./init-trade-economics-system";
import { registerTravelRoutes } from "./routes-travel";
import { initializeTravelSystem } from "./init-travel-system";
import { registerWeaponsArsenalRoutes } from "./routes-weapons-arsenal";
import { registerShipyardsRoutes } from "./routes-shipyards";
import { chatTranslationService } from "./chat-translation-service";
import { initializeDiplomaticMessaging } from "./routes-diplomatic-chat";
import { initializeSampleDiplomaticMessages } from "./init-diplomatic-messages";
import { realmManager } from "./realm-system";
import { registerRealmRoutes } from "./routes-realm-system";
import { accountManagementSystem } from "./account-management-system";
import { registerAccountManagementRoutes } from "./routes-account-management";
import { initializePatchManagement } from "./init-patch-management";
import { initializeExpansionSystem } from "./init-expansion-system";
import { initializeAdvancedDiplomaticSystem } from "./init-advanced-diplomatic";
import { registerAdvancedDiplomaticRoutes } from "./routes-advanced-diplomatic";
import { initializeUnitProductionSystem } from "./init-unit-production";
import { registerUnitProductionRoutes } from "./routes-unit-production";
import { registerAuthRoutes } from "./routes-auth";
import { authenticateToken } from "./auth-middleware";
import "./types"; // Import global type definitions

const app = express();
app.set('env', 'development');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Apply authentication middleware globally
app.use(authenticateToken);



// Setup Authentication routes FIRST to prevent interference
app.use('/api/auth', registerAuthRoutes());

// Add game version and info endpoints
import { getVersionInfo, getGameFeatures, getTechStack } from "./game-version";

app.get('/api/version', (req, res) => {
  res.json(getVersionInfo());
});

app.get('/api/game/info', (req, res) => {
  res.json({
    ...getVersionInfo(),
    features: getGameFeatures(),
    techStack: getTechStack()
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

async function initializeSystemsInBackground() {
  try {
    
    // Initialize Configuration System early in startup
    console.log("⚙️ Initializing Configuration System...");
    try {
      const { initializeConfigurationSystem } = await import('./init-configuration-system');
      const result = await initializeConfigurationSystem();
      console.log("✅ Configuration System initialized successfully");
    } catch (error) {
      console.error("❌ Configuration System initialization failed:", error);
      console.error("Full error:", error.message, error.stack);
    }
    console.log("Configuration System block completed, continuing startup...");
    
    // Initialize Blueprint System immediately after materials
    try {
      await initializeBlueprintSystem();
      console.log("✅ Blueprint system initialized successfully");
    } catch (error) {
      console.log("⚠️ Blueprint system initialization skipped:", error.message);
    }
    
    // Initialize combat system
    try {
      await initializeCombatSystem();
      console.log("✅ Combat system initialized successfully");
    } catch (error) {
      console.log("⚠️ Combat system initialization skipped:", error.message);
    }
    
    // Initialize story mode system (temporarily disabled due to SQL parameter conflicts)
    console.log("⚠️ Story mode system initialization disabled to prevent SQL parameter errors");
    
    // Initialize Stargate Network System
    console.log("Initializing Stargate Network System...");
    try {
      const { initializeStargateSystem } = await import('./init-stargate-system');
      await initializeStargateSystem();
      console.log("Stargate Network System initialization complete");
    } catch (error) {
      console.log("⚠️ Stargate Network System initialization skipped:", error.message);
    }
    

    
    // Initialize Admin System
    try {
      const { initializeAdminSystem } = await import('./init-admin');
      await initializeAdminSystem();
    } catch (error) {
      console.log("⚠️ Admin System initialization skipped:", error.message);
    }

    // Initialize Advanced Diplomatic System
    try {
      await initializeAdvancedDiplomaticSystem();
    } catch (error) {
      console.log("⚠️ Advanced Diplomatic System initialization skipped:", error.message);
    }

    // Initialize Alien Companion System
    try {
      const { initializeAlienCompanionSystem } = await import('./init-alien-companions');
      await initializeAlienCompanionSystem();
    } catch (error) {
      console.log("⚠️ Alien Companion System initialization skipped:", error.message);
    }

    // Initialize Billing System
    console.log("💳 Initializing Billing System...");
    try {
      const { initializeBillingSystem } = await import('./init-billing-system');
      await initializeBillingSystem();
      console.log("✅ Billing system initialized successfully");
    } catch (error) {
      console.log("⚠️ Billing system initialization skipped:", error.message);
    }
    
    // Initialize Progression System
    console.log("Initializing Empire Progression System...");
    try {
      const { initializeProgressionSystem } = await import('./init-progression-system');
      await initializeProgressionSystem();
      console.log("Empire Progression System initialization complete");
    } catch (error) {
      console.log("⚠️ Progression System initialization skipped:", error.message);
    }
    
    // Initialize Commander System
    console.log("Initializing Commander System...");
    try {
      const { initializeCommanderSystem } = await import('./init-commander-system');
      await initializeCommanderSystem();
      console.log("Commander System initialization complete");
    } catch (error) {
      console.log("⚠️ Commander System initialization skipped:", error.message);
    }
    
    // Initialize Governance & Religion System
    console.log("Initializing Governance & Religion System...");
    try {
      const { initializeGovernanceReligionSystem } = await import('./init-governance-religion');
      await initializeGovernanceReligionSystem();
      console.log("Governance & Religion System initialization complete");
    } catch (error) {
      console.log("⚠️ Governance & Religion System initialization skipped:", error.message);
    }
    
    // Initialize World Building System
    console.log("Initializing World Building System...");
    try {
      const { initializeWorldBuildingSystem } = await import('./init-world-building');
      await initializeWorldBuildingSystem();
      console.log("World Building System initialization complete");
    } catch (error) {
      console.log("⚠️ World Building System initialization skipped:", error.message);
    }
    
    // Initialize Universe Seed System
    console.log("Initializing Universe Seed System...");
    try {
      const { initializeUniverseSeedSystem } = await import('./init-universe-seed');
      await initializeUniverseSeedSystem();
      console.log("Universe Seed System initialization complete");
    } catch (error) {
      console.log("⚠️ Universe Seed System initialization skipped:", error.message);
    }
    
    // Initialize Planetary Classification System (A-Z)
    console.log("Initializing Planetary Classification System...");
    try {
      const { initializePlanetaryClassifications } = await import('./planetary-classification-system');
      await initializePlanetaryClassifications();
      console.log("Planetary Classification System initialization complete");
    } catch (error) {
      console.log("⚠️ Planetary Classification System initialization skipped:", error.message);
    }
    
    // Initialize Homeworld Protection System
    console.log("Initializing Homeworld Protection System...");
    try {
      await initializeHomeworldProtection();
      console.log("Homeworld Protection System initialization complete");
    } catch (error) {
      console.log("⚠️ Homeworld Protection System initialization skipped:", error.message);
    }
    
    // Initialize Sol Systems and Racial Homeworlds
    console.log("Initializing Sol Systems and Racial Homeworlds...");
    try {
      const { initializeSolSystems } = await import('./init-sol-systems');
      await initializeSolSystems();
      console.log("Sol Systems and Racial Homeworlds initialization complete");
    } catch (error) {
      console.log("⚠️ Sol Systems initialization skipped:", error.message);
    }
    
    // Initialize Buildings & Infrastructure System
    console.log("Initializing Buildings & Infrastructure System...");
    try {
      await buildingsInfrastructure.initializeBuildingTypes();
      console.log("Buildings & Infrastructure System initialization complete");
    } catch (error) {
      console.log("⚠️ Buildings & Infrastructure System initialization skipped:", error.message);
    }
    
    // Initialize Game Research System
    console.log("Initializing Game Research System...");
    try {
      await initializeGameResearch();
      console.log("Game Research System initialization complete");
    } catch (error) {
      console.log("⚠️ Game Research System initialization skipped:", (error as Error).message);
    }

    // Initialize Empire World Age System
    console.log("Initializing Empire World Age System...");
    try {
      await initializeEmpireWorldAgeSystem();
      console.log("Empire World Age System initialization complete");
    } catch (error) {
      console.log("⚠️ Empire World Age System initialization skipped:", error.message);
    }
    
    // Initialize Diplomatic System
    console.log("Initializing Diplomatic System...");
    try {
      await diplomaticSystem.initializeDiplomaticSystem();
      console.log("Diplomatic System initialization complete");
    } catch (error) {
      console.log("⚠️ Diplomatic System initialization skipped:", error.message);
    }
    
    // Initialize Trade Economics System
    console.log("Initializing Trade Economics System...");
    try {
      await tradeEconomicsSystem.initializeTradeEconomicsSystem();
      console.log("Trade Economics System initialization complete");
    } catch (error) {
      console.log("⚠️ Trade Economics System initialization skipped:", error.message);
    }
    
    // Initialize Interplanetary Travel System with 16 Universes
    console.log("Initializing Interplanetary Travel System...");
    try {
      const { initializeTravelSystemClean } = await import('./init-travel-system-clean');
      await initializeTravelSystemClean();
      console.log("Interplanetary Travel System initialization complete");
    } catch (error) {
      console.log("⚠️ Interplanetary Travel System initialization skipped:", error.message);
    }
    
    // Initialize Shop System
    console.log("Initializing OGame-Style Shop System...");
    try {
      const { initializeShopSystem } = await import('./init-shop-system');
      await initializeShopSystem();
      console.log("Shop System initialization complete");
    } catch (error) {
      console.log("⚠️ Shop System initialization skipped:", error.message);
    }
    
    // Initialize materials system
    console.log("Initializing materials system...");
    await initializeMaterialsSystem();
    console.log("Materials catalog already initialized");
    
    // Initialize Chat Translation System
    console.log("🌐 Initializing Chat Translation System...");
    try {
      const { chatTranslationService } = await import('./chat-translation-service');
      await chatTranslationService.initializeTranslationTables();
      console.log("✅ Chat Translation System initialized successfully!");
    } catch (error) {
      console.log("⚠️ Chat Translation System initialization skipped:", (error as Error).message);
    }
    
    // Initialize Sol Systems and Racial Homeworlds
    console.log("Initializing Sol Systems and Racial Homeworlds...");
    try {
      const { initializeSolSystems } = await import('./init-sol-systems');
      await initializeSolSystems();
      console.log("Sol Systems and Racial Homeworlds initialization complete");
    } catch (error) {
      console.log("⚠️ Sol Systems initialization skipped:", (error as Error).message);
    }
    
    // Initialize Unit Production System
    console.log("🏭 Initializing Unit Production System...");
    try {
      await initializeUnitProductionSystem();
      console.log("✅ Unit Production System initialized successfully!");
    } catch (error) {
      console.log("⚠️ Unit Production System initialization skipped:", (error as Error).message);
    }
    
    const server = await registerRoutes(app);
    
    // Setup OGame Research routes
    await setupGameResearchRoutes(app);
    
    // Setup Billing routes
    const { registerBillingRoutes } = await import('./routes-billing');
    registerBillingRoutes(app);
    
    // Setup Expedition Dark Matter routes
    const { registerExpeditionDarkMatterRoutes } = await import('./routes-expedition-dark-matter');
    registerExpeditionDarkMatterRoutes(app);
    
    // Setup Expedition routes
    const { registerExpeditionRoutes } = await import('./routes-expeditions');
    registerExpeditionRoutes(app);
    
    // Setup Solar Systems routes
    const { registerSolarSystemRoutes } = await import('./routes-solar-systems');
    registerSolarSystemRoutes(app);
    
    // Setup Travel routes
    const { registerTravelRoutes } = await import('./routes-travel-simple');
    registerTravelRoutes(app);
    
    // Setup Admin Game Configuration routes
    const { registerAdminGameConfigRoutes } = await import('./routes-admin-game-config');
    registerAdminGameConfigRoutes(app);
    
    // Setup Starship Construction routes
    const { registerStarshipConstructionRoutes } = await import('./routes-starship-construction');
    registerStarshipConstructionRoutes(app);
    
    // Setup Weapons Arsenal routes
    registerWeaponsArsenalRoutes(app);
    
    // Setup Shipyards routes
    registerShipyardsRoutes(app);
    
    // Setup Shop routes
    const shopRoutes = await import('./routes-shop');
    app.use(shopRoutes.default);
    
    // Authentication routes already registered at startup
    
    // Setup Forum routes
    const { registerForumRoutes } = await import('./routes-forum');
    registerForumRoutes(app);
    
    // Setup OGame Universe routes
    const { registerOGameUniverseRoutes } = await import('./routes-ogame-universe');
    registerOGameUniverseRoutes(app);

    // Setup Maintenance routes
    const maintenanceRoutes = await import('./routes-maintenance');
    app.use('/api/maintenance', maintenanceRoutes.default);

    // Initialize Maintenance System
    const { maintenanceManager } = await import('./maintenance-system');
    await maintenanceManager.initialize();

    // Initialize Achievement System
    console.log("🏆 Initializing Achievement System...");
    try {
      const { initializeAchievementSystem } = await import('./routes-achievements');
      await initializeAchievementSystem();
      console.log("✅ Achievement System initialized successfully!");
    } catch (error) {
      console.log("⚠️ Achievement System initialization skipped:", (error as Error).message);
    }

    // Initialize Enhanced Dungeons System
    console.log("🌌 Initializing Enhanced Dungeons System...");
    try {
      const { initializeEnhancedDungeonsSystem } = await import('./routes-enhanced-dungeons');
      await initializeEnhancedDungeonsSystem();
      console.log("✅ Enhanced Dungeons System initialized successfully!");
    } catch (error) {
      console.log("⚠️ Enhanced Dungeons System initialization skipped:", (error as Error).message);
    }

    // Initialize Social Systems
    console.log("🤝 Initializing Social Systems...");
    try {
      const { initializeSocialSystems } = await import('./routes-social-systems');
      await initializeSocialSystems();
      console.log("✅ Social Systems initialized successfully!");
    } catch (error) {
      console.log("⚠️ Social Systems initialization skipped:", (error as Error).message);
    }

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

  } catch (error) {
    console.error("Fatal error during server startup:", error);
    process.exit(1);
  }
}

// Cleaned up duplicate function declaration

async function initializeRemainingSystemsAsync() {
  // Initialize Story Mode System
  console.log("Initializing Story Mode System...");
  try {
    await initializeStoryModeSystem();
    console.log("Story Mode System initialization complete");
  } catch (error: any) {
    console.log("⚠️ Story Mode System initialization skipped:", error.message);
  }

  // Initialize Blueprint System
  console.log("Initializing Blueprint System...");
  try {
    await initializeBlueprintSystem();
    console.log("Blueprint System initialization complete");
  } catch (error: any) {
    console.log("⚠️ Blueprint System initialization skipped:", error.message);
  }

  // Initialize Combat System
  console.log("Initializing Combat System...");
  try {
    await initializeCombatSystem();
    console.log("Combat System initialization complete");
  } catch (error: any) {
    console.log("⚠️ Combat System initialization skipped:", error.message);
  }

  console.log("🎯 All background systems initialized successfully!");
}

(async () => {
  const server = await registerRoutes(app);
  
  // Handle PHP files in the forum directory
  app.use('/website/forum', (req, res, next) => {
    if (req.path.endsWith('.php')) {
      const phpFile = path.join(process.cwd(), 'website', 'forum', req.path);
      const php = spawn('php', ['-f', phpFile], {
        env: { 
          ...process.env,
          REQUEST_METHOD: req.method, 
          QUERY_STRING: new URL(`http://localhost${req.url}`).search.slice(1),
          DATABASE_URL: process.env.DATABASE_URL
        }
      });
      
      let output = '';
      let errorOutput = '';
      
      php.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      php.stderr.on('data', (data) => {
        errorOutput += data.toString();
      });
      
      php.on('close', (code) => {
        if (code === 0) {
          res.setHeader('Content-Type', 'text/html');
          res.send(output);
        } else {
          console.error('PHP Error:', errorOutput);
          res.status(500).send('PHP execution error: ' + errorOutput);
        }
      });
    } else {
      next();
    }
  });
  
  // Serve static website files
  app.use('/website', express.static('website'));
  
  // Setup the Vite server in development mode
  if (app.get('env') === 'development') {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Initialize database and core systems first
  console.log("🚀 Starting Galactic Empire Server...");
  await initializeDatabase();

  // Initialize Patch Management System
  try {
    await initializePatchManagement();
  } catch (error) {
    console.log("⚠️ Patch Management System initialization skipped:", error.message);
  }

  // Initialize Expansion System
  try {
    await initializeExpansionSystem();
  } catch (error) {
    console.log("⚠️ Expansion System initialization skipped:", error.message);
  }

  // Start background initialization
  initializeSystemsInBackground();

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, '0.0.0.0', () => {
    log(`Server running on http://0.0.0.0:${PORT}`);
  });
})();
