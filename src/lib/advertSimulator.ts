import { updateAdvertStatistics } from "./advertStorage";

/**
 * Track impression when advert is shown
 */
export function trackImpression(advertId: string): void {
  try {
    const adverts = JSON.parse(localStorage.getItem("mobigate_adverts") || "[]");
    const advert = adverts.find((ad: any) => ad.id === advertId);
    
    if (!advert) return;

    updateAdvertStatistics(advertId, {
      impressions: (advert.statistics?.impressions || 0) + 1,
      displayedToday: (advert.statistics?.displayedToday || 0) + 1,
      lastDisplayed: new Date(),
    });
  } catch (error) {
    console.error("Error tracking impression:", error);
  }
}

/**
 * Track click when advert is clicked
 */
export function trackClick(advertId: string): void {
  try {
    const adverts = JSON.parse(localStorage.getItem("mobigate_adverts") || "[]");
    const advert = adverts.find((ad: any) => ad.id === advertId);
    
    if (!advert) return;

    updateAdvertStatistics(advertId, {
      clicks: (advert.statistics?.clicks || 0) + 1,
    });

    // Simulate revenue (5 Mobi per click as per knowledge base)
    updateAdvertStatistics(advertId, {
      revenue: (advert.statistics?.revenue || 0) + 5,
    });
  } catch (error) {
    console.error("Error tracking click:", error);
  }
}

/**
 * Track view when advert is opened/expanded for details
 */
export function trackView(advertId: string): void {
  try {
    const adverts = JSON.parse(localStorage.getItem("mobigate_adverts") || "[]");
    const advert = adverts.find((ad: any) => ad.id === advertId);
    
    if (!advert) return;

    updateAdvertStatistics(advertId, {
      views: (advert.statistics?.views || 0) + 1,
    });
  } catch (error) {
    console.error("Error tracking view:", error);
  }
}

/**
 * Simulate daily displays reset (call this on app init)
 */
export function initializeDailyDisplayReset(): void {
  const lastResetDate = localStorage.getItem("mobigate_last_display_reset");
  const today = new Date().toDateString();

  if (lastResetDate !== today) {
    // Reset all adverts' displayedToday counter
    try {
      const adverts = JSON.parse(localStorage.getItem("mobigate_adverts") || "[]");
      
      adverts.forEach((advert: any) => {
        updateAdvertStatistics(advert.id, {
          displayedToday: 0,
        });
      });

      localStorage.setItem("mobigate_last_display_reset", today);
    } catch (error) {
      console.error("Error resetting daily displays:", error);
    }
  }
}

/**
 * Simulate random advert displays based on DPD package
 * This runs periodically to simulate realistic advert performance
 */
export function simulateAdvertDisplays(): void {
  try {
    const adverts = JSON.parse(localStorage.getItem("mobigate_adverts") || "[]");
    const activeAdverts = adverts.filter(
      (ad: any) => ad.status === "active" || ad.status === "approved"
    );

    activeAdverts.forEach((advert: any) => {
      const dpd = advert.pricing?.displayPerDay || 0;
      
      // Don't exceed DPD limit
      if (advert.statistics?.displayedToday >= dpd && dpd !== 0) {
        return;
      }

      // Random chance to display (simulate realistic distribution)
      const displayChance = Math.random();
      
      // Higher DPD = higher chance to display
      const threshold = Math.min(dpd / 5000, 0.5); // Max 50% chance
      
      if (displayChance < threshold) {
        trackImpression(advert.id);
        
        // Random chance for clicks (1-5% of impressions)
        if (Math.random() < 0.03) {
          trackClick(advert.id);
        }
        
        // Random chance for views (0.5-2% of impressions)
        if (Math.random() < 0.01) {
          trackView(advert.id);
        }
      }
    });
  } catch (error) {
    console.error("Error simulating displays:", error);
  }
}

/**
 * Start the advert simulator (call once on app init)
 */
export function startAdvertSimulator(): void {
  // Initialize daily reset
  initializeDailyDisplayReset();
  
  // Simulate displays every 30 seconds
  setInterval(() => {
    simulateAdvertDisplays();
  }, 30000);
  
  // Reset daily counters at midnight
  setInterval(() => {
    initializeDailyDisplayReset();
  }, 3600000); // Check every hour
}
