import { storage } from "./server/storage";

// Test storage interface compilation
async function testStorageInterface() {
  try {
    // Test messaging methods
    const folders = await storage.getPlayerMessageFolders(1);
    console.log("✓ getPlayerMessageFolders works");
    
    const messages = await storage.getPlayerInboxMessages(1);
    console.log("✓ getPlayerInboxMessages works");
    
    const chatZones = await storage.getChatZones();
    console.log("✓ getChatZones works");
    
    // Test planetary systems methods
    const biomes = await storage.getPlanetaryBiomes(1);
    console.log("✓ getPlanetaryBiomes works");
    
    console.log("All storage interface methods compiled successfully!");
  } catch (error) {
    console.error("Storage interface error:", error);
  }
}

testStorageInterface();