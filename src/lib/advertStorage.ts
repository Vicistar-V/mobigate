import { SavedAdvert, AdvertFormData, AdvertPricing } from "@/types/advert";

const STORAGE_KEY = "mobigate_adverts";
const DRAFT_KEY = "mobigate_advert_draft";

// Mock user ID - in real app this would come from auth
const MOCK_USER_ID = "user-123";

export function saveAdvertDraft(formData: Partial<AdvertFormData>): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
  } catch (error) {
    console.error("Failed to save draft:", error);
  }
}

export function loadAdvertDraft(): Partial<AdvertFormData> | null {
  try {
    const draft = localStorage.getItem(DRAFT_KEY);
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    console.error("Failed to load draft:", error);
    return null;
  }
}

export function clearAdvertDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (error) {
    console.error("Failed to clear draft:", error);
  }
}

export function saveAdvert(
  formData: AdvertFormData,
  pricing: AdvertPricing
): SavedAdvert {
  try {
    // Convert files to data URLs for storage
    const fileUrls = formData.files.map(file => URL.createObjectURL(file));

    const newAdvert: SavedAdvert = {
      id: `ad-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: MOCK_USER_ID,
      category: formData.category,
      type: formData.type,
      size: formData.size,
      dpdPackage: formData.dpdPackage,
      extendedExposure: formData.extendedExposure,
      recurrentAfter: formData.recurrentAfter,
      recurrentEvery: formData.recurrentEvery,
      catchmentMarket: formData.catchmentMarket,
      launchDate: formData.launchDate || new Date(),
      fileUrls,
      status: "pending",
      pricing,
      statistics: {
        impressions: 0,
        clicks: 0,
        views: 0,
        revenue: 0,
        displayedToday: 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      contactPhone: formData.contactPhone,
      contactMethod: formData.contactMethod,
      contactEmail: formData.contactEmail,
      websiteUrl: formData.websiteUrl,
    };

    // Get existing adverts
    const adverts = loadAllAdverts();
    adverts.unshift(newAdvert);

    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(adverts));

    // Clear draft
    clearAdvertDraft();

    return newAdvert;
  } catch (error) {
    console.error("Failed to save advert:", error);
    throw new Error("Failed to save advert");
  }
}

export function loadAllAdverts(): SavedAdvert[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const adverts = JSON.parse(data);
    // Convert date strings back to Date objects
    return adverts.map((ad: any) => ({
      ...ad,
      launchDate: new Date(ad.launchDate),
      createdAt: new Date(ad.createdAt),
      updatedAt: new Date(ad.updatedAt),
      approvedAt: ad.approvedAt ? new Date(ad.approvedAt) : undefined,
      expiresAt: ad.expiresAt ? new Date(ad.expiresAt) : undefined,
      statistics: {
        ...ad.statistics,
        lastDisplayed: ad.statistics.lastDisplayed ? new Date(ad.statistics.lastDisplayed) : undefined,
      },
    }));
  } catch (error) {
    console.error("Failed to load adverts:", error);
    return [];
  }
}

export function loadUserAdverts(userId: string = MOCK_USER_ID): SavedAdvert[] {
  const allAdverts = loadAllAdverts();
  return allAdverts.filter(ad => ad.userId === userId);
}

export function updateAdvertStatus(
  advertId: string,
  status: SavedAdvert["status"],
  rejectedReason?: string
): void {
  try {
    const adverts = loadAllAdverts();
    const index = adverts.findIndex(ad => ad.id === advertId);

    if (index === -1) {
      throw new Error("Advert not found");
    }

    adverts[index].status = status;
    adverts[index].updatedAt = new Date();

    if (status === "approved") {
      adverts[index].approvedAt = new Date();
      // Set expiration to 24 months from approval
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 24);
      adverts[index].expiresAt = expiresAt;
      // Set standard approval message
      adverts[index].approvedReason = "Congratulations! Your advertisement has been reviewed and approved by our team. Your advert meets all our quality standards and guidelines. It is now active and will begin displaying to your target audience according to your selected DPD package and catchment market settings. Thank you for advertising with us!";
    }

    if (status === "rejected" && rejectedReason) {
      adverts[index].rejectedReason = rejectedReason;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(adverts));
  } catch (error) {
    console.error("Failed to update advert status:", error);
    throw error;
  }
}

export function deleteAdvert(advertId: string): void {
  try {
    const adverts = loadAllAdverts();
    const filtered = adverts.filter(ad => ad.id !== advertId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete advert:", error);
    throw error;
  }
}

export function updateAdvertStatistics(
  advertId: string,
  updates: Partial<SavedAdvert["statistics"]>
): void {
  try {
    const adverts = loadAllAdverts();
    const index = adverts.findIndex(ad => ad.id === advertId);

    if (index === -1) {
      throw new Error("Advert not found");
    }

    adverts[index].statistics = {
      ...adverts[index].statistics,
      ...updates,
    };
    adverts[index].updatedAt = new Date();

    localStorage.setItem(STORAGE_KEY, JSON.stringify(adverts));
  } catch (error) {
    console.error("Failed to update statistics:", error);
    throw error;
  }
}

export function updateAdvertMedia(
  advertId: string,
  newFiles: File[]
): void {
  try {
    const adverts = loadAllAdverts();
    const index = adverts.findIndex(ad => ad.id === advertId);

    if (index === -1) {
      throw new Error("Advert not found");
    }

    // Convert new files to URLs
    const fileUrls = newFiles.map(file => URL.createObjectURL(file));

    adverts[index].fileUrls = fileUrls;
    adverts[index].updatedAt = new Date();
    
    // Reset status to pending for admin re-approval
    adverts[index].status = "pending";
    adverts[index].approvedAt = undefined;
    adverts[index].rejectedReason = undefined;
    adverts[index].approvedReason = undefined;
    adverts[index].expiresAt = undefined;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(adverts));
  } catch (error) {
    console.error("Failed to update media:", error);
    throw error;
  }
}
