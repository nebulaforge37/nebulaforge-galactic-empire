import { useState, useEffect } from 'react';
import { Router, Route } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import EnhancedLogin from '@/pages/enhanced-login';
import GameHub from '@/pages/game-hub';
import Game from '@/pages/game';
import AdminPanel from '@/pages/admin';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminDashboardNew from '@/pages/admin-dashboard';
import AdminConfiguration from '@/pages/AdminConfiguration';
import AdminGameConfig from '@/pages/AdminGameConfig';
import HomeworldProtectionPage from '@/pages/homeworld-protection';
import BuildingsInfrastructurePage from '@/pages/buildings-infrastructure';
import OGameResearchPage from '@/pages/ogame-research';
import ResearchBranchesDemo from '@/pages/research-branches-demo';
import TermsOfService from '@/pages/terms-of-service';
import PrivacyPolicy from '@/pages/privacy-policy';
import SolarSystems from '@/pages/solar-systems';
import FleetTravel from '@/pages/fleet-travel';
import TravelSystem from '@/pages/TravelSystem';
import StarshipConstruction from '@/pages/StarshipConstruction';
import WeaponsArsenal from '@/pages/WeaponsArsenal';
import Shipyards from '@/pages/Shipyards';
import FleetCommand from '@/pages/FleetCommand';
import MilitaryAcademy from '@/pages/MilitaryAcademy';
import TacticalOperations from '@/pages/TacticalOperations';
import DefenseSystems from '@/pages/DefenseSystems';
import AIFactions from '@/pages/ai-factions';
import AIMillitary from '@/pages/ai-military';
import BattlePass from '@/pages/battle-pass';
import Billing from '@/pages/billing';
import Blueprints from '@/pages/blueprints';
import KnowledgeTree from '@/pages/knowledge-tree';
import MasterWorkshop from '@/pages/master-workshop';
import LootDiscovery from '@/pages/loot-discovery';
import Combat from '@/pages/combat';
import Commanders from '@/pages/commanders';
import Configuration from '@/pages/configuration';
import Defcon from '@/pages/defcon';
import Diplomatic from '@/pages/diplomatic';
import EmpireWorldAge from '@/pages/empire-world-age';
import ExpeditionDarkMatter from '@/pages/expedition-dark-matter';
import Expeditions from '@/pages/expeditions';
import Exploration from '@/pages/exploration';
import FactionVendors from '@/pages/faction-vendors';
import FTL from '@/pages/ftl';
import HomeworldProtection from '@/pages/homeworld-protection';
import Kardashev from '@/pages/kardashev';
import Leaderboard from '@/pages/leaderboard';
import Materials from '@/pages/materials';
import MilitaryInfrastructure from './pages/military-infrastructure';
import UnitProductionManagement from './pages/unit-production-management';
import NemesisWorld from '@/pages/nemesis-world';
import Notifications from '@/pages/notifications';
import AccountManagement from '@/pages/account-management';
import DiplomaticChatDemo from '@/pages/diplomatic-chat-demo';
import PlanetaryClassifications from '@/pages/planetary-classifications';
import PlanetaryGeography from '@/pages/planetary-geography';
import PlanetarySystems from '@/pages/planetary-systems';
import Research from '@/pages/research';
import SeasonMissions from '@/pages/season-missions';
import StellarPhenomena from '@/pages/stellar-phenomena';
import StoryMode from '@/pages/story-mode';
import TradeEconomics from '@/pages/trade-economics';
import TurnBasedCombat from '@/pages/turn-based-combat';
import UniverseMap from '@/pages/universe-map';
import MilitaryLogistics from '@/pages/MilitaryLogistics';
import DungeonRaidFinder from '@/pages/DungeonRaidFinder';
import TranslationCenter from '@/pages/TranslationCenter';
import MaintenanceAdmin from '@/pages/MaintenanceAdmin';
import RealmSelection from '@/pages/realm-selection';
import PatchManagement from '@/pages/patch-management';
import ExpansionStorePage from '@/pages/expansion-store';
import ScreenSettingsPage from '@/pages/screen-settings';
import AlienCompanions from '@/pages/AlienCompanions';
import Legal from '@/pages/Legal';
import GameInfo from '@/pages/GameInfo';
import Community from '@/pages/Community';
import Support from '@/pages/Support';
import MainNavigation from '@/pages/MainNavigation';
import Features from '@/pages/Features';
import CommunityForum from '@/pages/CommunityForum';
import MobileDownloadPage from '@/pages/mobile-download';
import DevelopmentMetrics from '@/pages/development-metrics';
import DiplomaticCouncil from '@/pages/diplomatic-council';
import UnitProduction from '@/pages/unit-production';
import EnhancedUnitProduction from '@/pages/enhanced-unit-production';
import ThemeSelectorPage from '@/pages/theme-selector-page';
import Settings from '@/pages/settings';
import AdvancedMechanics from '@/pages/advanced-mechanics';
import UltraAdvancedMechanics from '@/pages/ultra-advanced-mechanics';
import TranscendentMechanics from '@/pages/transcendent-mechanics';
import GalacticCivilizations from '@/pages/galactic-civilizations';
import DisplaySettings from '@/pages/display-settings';
import UserProfile from '@/pages/user-profile';
import Leaderboards from '@/pages/leaderboards';
import SocialHub from '@/pages/social-hub';
import Alliances from '@/pages/alliances';
import ResourceTrading from '@/pages/resource-trading';
import EspionageNetwork from '@/pages/espionage-network';
import ColonyManagement from '@/pages/colony-management';
import PlayerProfile from '@/pages/player-profile';
import Achievements from '@/pages/achievements';
import Guilds from '@/pages/guilds';
import AuthPage from '@/pages/auth-page';
import { MaintenanceBanner } from '@/components/MaintenanceBanner';
import { UnifiedMenu, QuickAccessMenu } from '@/components/unified-menu-system';
import AppLayout from '@/components/app-layout';
import { ThemeProvider } from '@/contexts/theme-context';
import { AuthProvider } from '@/hooks/use-auth';
import NotFound from '@/pages/not-found';
import Homepage from '@/pages/homepage';
import Login from '@/pages/login';
import DebugLoggingSystem from '@/pages/debug-logs';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  const [player, setPlayer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const token = localStorage.getItem('authToken');
    if (token) {
      validateSession(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const validateSession = async (token: string) => {
    try {
      const response = await fetch('/api/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPlayer(data.player);
      } else {
        localStorage.removeItem('authToken');
      }
    } catch (error) {
      console.error('Session validation failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (playerData: any, token: string) => {
    localStorage.setItem('authToken', token);
    setPlayer(playerData);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }

    localStorage.removeItem('authToken');
    setPlayer(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-space-blue via-deep-space to-cosmic-purple flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-electric-blue"></div>
          <p className="mt-4 text-electric-blue">Initializing Galactic Empire...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <MaintenanceBanner />
        <Router>
        <Route path="/login">
          {player ? <GameHub player={player} onLogout={handleLogout} onNavigate={() => {}} /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/admin-login">
          <AdminLogin />
        </Route>
        <Route path="/admin-dashboard">
          <AdminDashboard />
        </Route>
        <Route path="/admin-panel">
          <AdminPanel />
        </Route>
        <Route path="/admin-config">
          <AdminConfiguration />
        </Route>
        <Route path="/admin/game-config">
          <AdminGameConfig />
        </Route>
        <Route path="/admin">
          <AdminDashboard />
        </Route>
        <Route path="/admin/enhanced">
          <AdminDashboardNew />
        </Route>
        <Route path="/social-hub">
          {player ? <SocialHub /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/homeworld-protection">
          {player ? <HomeworldProtectionPage /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/buildings-infrastructure">
          {player ? <BuildingsInfrastructurePage player={player} /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/ogame-research">
          {player ? <OGameResearchPage /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/research-branches">
          {player ? <ResearchBranchesDemo /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/solar-systems">
          <SolarSystems />
        </Route>
        <Route path="/fleet-travel">
          {player ? <FleetTravel /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/travel-system">
          {player ? <TravelSystem /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/starship-construction">
          {player ? <StarshipConstruction /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/weapons-arsenal">
          {player ? <WeaponsArsenal /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/shipyards">
          {player ? <Shipyards /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/fleet-command">
          {player ? <FleetCommand /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/military-academy">
          {player ? <MilitaryAcademy /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/tactical-operations">
          {player ? <TacticalOperations /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/defense-systems">
          {player ? <DefenseSystems /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/logistics">
          {player ? <MilitaryLogistics /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/dungeons">
          {player ? <DungeonRaidFinder /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/translation-center">
          {player ? <TranslationCenter /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/ai-factions">
          {player ? <AIFactions /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/ai-military">
          {player ? <AIMillitary /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/battle-pass">
          {player ? <BattlePass /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/billing">
          {player ? <Billing /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/account-management">
          {player ? <AccountManagement /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/blueprints">
          {player ? <Blueprints /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/knowledge-tree">
          {player ? <KnowledgeTree /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/master-workshop">
          {player ? <MasterWorkshop /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/loot-discovery">
          {player ? <LootDiscovery /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/combat">
          {player ? <Combat /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/commanders">
          {player ? <Commanders /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/configuration">
          {player ? <Configuration /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/defcon">
          {player ? <Defcon /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/diplomatic">
          {player ? <Diplomatic /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/diplomatic-chat">
          <DiplomaticChatDemo />
        </Route>
        <Route path="/empire-world-age">
          {player ? <EmpireWorldAge /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/expedition-dark-matter">
          {player ? <ExpeditionDarkMatter /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/expeditions">
          {player ? <Expeditions /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/exploration">
          {player ? <Exploration /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/faction-vendors">
          {player ? <FactionVendors /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/ftl">
          {player ? <FTL /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/kardashev">
          {player ? <Kardashev /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/leaderboard">
          {player ? <Leaderboard /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/materials">
          {player ? <Materials /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/military-infrastructure">
          {player ? <MilitaryInfrastructure /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
          <Route path="/unit-production-management">
              {player ? <UnitProductionManagement /> : <EnhancedLogin onLogin={handleLogin} />}
          </Route>
        <Route path="/nemesis-world">
          {player ? <NemesisWorld /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/notifications">
          {player ? <Notifications /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/planetary-classifications">
          {player ? <PlanetaryClassifications /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/planetary-geography">
          {player ? <PlanetaryGeography /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/planetary-systems">
          {player ? <PlanetarySystems /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/research">
          {player ? <Research /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/season-missions">
          {player ? <SeasonMissions /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/stellar-phenomena">
          {player ? <StellarPhenomena /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/story-mode">
          {player ? <StoryMode /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/trade-economics">
          {player ? <TradeEconomics /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/turn-based-combat">
          {player ? (
            <AppLayout variant="game" player={player} onLogout={handleLogout}>
              <TurnBasedCombat />
            </AppLayout>
          ) : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/unit-production">
          {player ? (
            <AppLayout variant="game" player={player} onLogout={handleLogout}>
              <UnitProduction />
            </AppLayout>
          ) : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/enhanced-unit-production">
          {player ? (
            <AppLayout variant="game" player={player} onLogout={handleLogout}>
              <EnhancedUnitProduction />
            </AppLayout>
          ) : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/universe-map">
          {player ? <UniverseMap /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/admin/maintenance">
          <MaintenanceAdmin />
        </Route>
        <Route path="/admin/patch-management">
          <PatchManagement />
        </Route>
        <Route path="/expansion-store">
          {player ? <ExpansionStorePage /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/screen-settings">
          <ScreenSettingsPage />
        </Route>
        <Route path="/display-settings">
          <DisplaySettings />
        </Route>
        <Route path="/user-profile">
          {player ? <UserProfile /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/leaderboards">
          {player ? <Leaderboards /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/social-hub">
          {player ? <SocialHub /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/alliances">
          {player ? <Alliances /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/resource-trading">
          {player ? <ResourceTrading /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/espionage-network">
          {player ? <EspionageNetwork /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/colony-management">
          {player ? <ColonyManagement /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/alien-companions">
          {player ? <AlienCompanions /> : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/legal">
          <Legal />
        </Route>
        <Route path="/game-info">
          <GameInfo />
        </Route>
        <Route path="/community">
          <Community />
        </Route>
        <Route path="/forum">
          <CommunityForum />
        </Route>
        <Route path="/support">
          <Support />
        </Route>
        <Route path="/features">
          <Features />
        </Route>
        <Route path="/navigation">
          <MainNavigation />
        </Route>
        <Route path="/mobile-download">
          <MobileDownloadPage />
        </Route>
        <Route path="/development-metrics">
          <DevelopmentMetrics />
        </Route>
        <Route path="/themes">
          <AppLayout variant="home" player={player} onLogout={handleLogout}>
            <ThemeSelectorPage />
          </AppLayout>
        </Route>
        <Route path="/settings">
          {player ? (
            <AppLayout variant="game" player={player} onLogout={handleLogout}>
              <Settings />
            </AppLayout>
          ) : (
            <AppLayout variant="home" player={player} onLogout={handleLogout}>
              <Settings />
            </AppLayout>
          )}
        </Route>
        <Route path="/advanced-mechanics">
          {player ? (
            <AppLayout variant="game" player={player} onLogout={handleLogout}>
              <AdvancedMechanics />
            </AppLayout>
          ) : (
            <AppLayout variant="home" player={player} onLogout={handleLogout}>
              <AdvancedMechanics />
            </AppLayout>
          )}
        </Route>
        <Route path="/ultra-advanced-mechanics">
          {player ? (
            <AppLayout variant="game" player={player} onLogout={handleLogout}>
              <UltraAdvancedMechanics />
            </AppLayout>
          ) : (
            <AppLayout variant="home" player={player} onLogout={handleLogout}>
              <UltraAdvancedMechanics />
            </AppLayout>
          )}
        </Route>
        <Route path="/transcendent-mechanics">
          {player ? (
            <AppLayout variant="game" player={player} onLogout={handleLogout}>
              <TranscendentMechanics />
            </AppLayout>
          ) : (
            <AppLayout variant="home" player={player} onLogout={handleLogout}>
              <TranscendentMechanics />
            </AppLayout>
          )}
        </Route>
        <Route path="/galactic-civilizations">
          <AppLayout variant="game" player={player} onLogout={handleLogout}>
            <GalacticCivilizations />
          </AppLayout>
        </Route>
        <Route path="/diplomatic-council">
          {player ? (
            <AppLayout variant="game" player={player} onLogout={handleLogout}>
              <DiplomaticCouncil />
            </AppLayout>
          ) : <EnhancedLogin onLogin={handleLogin} />}
        </Route>
        <Route path="/realm-selection">
          <RealmSelection />
        </Route>
        <Route path="/terms-of-service">
          <TermsOfService />
        </Route>
        <Route path="/privacy-policy">
          <PrivacyPolicy />
        </Route>
        <Route path="/auth">
          <AuthPage />
        </Route>
        <Route path="/player-profile">
          {player ? (
            <AppLayout variant="game" player={player} onLogout={handleLogout}>
              <PlayerProfile />
            </AppLayout>
          ) : <AuthPage />}
        </Route>
        <Route path="/achievements">
          {player ? (
            <AppLayout variant="game" player={player} onLogout={handleLogout}>
              <Achievements />
            </AppLayout>
          ) : <AuthPage />}
        </Route>
        <Route path="/guilds">
          {player ? (
            <AppLayout variant="game" player={player} onLogout={handleLogout}>
              <Guilds />
            </AppLayout>
          ) : <AuthPage />}
        </Route>
        <Route path="/leaderboards">
          {player ? (
            <AppLayout variant="game" player={player} onLogout={handleLogout}>
              <Leaderboards />
            </AppLayout>
          ) : <AuthPage />}
        </Route>
        <Route path="/">
          {player ? <Game player={player} onLogout={handleLogout} /> : <Login onLogin={handleLogin} />}
        </Route>
        <Route path="/homepage">
          <Homepage />
        </Route>
        <Route path="/game">
          <Game player={player || { id: 0, username: 'Demo Player', email: 'demo@nebulaforge.com', isDemo: true }} onLogout={handleLogout} />
        </Route>
        <Route>
          <NotFound />
        </Route>
        </Router>
        <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}