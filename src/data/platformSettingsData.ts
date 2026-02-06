// Platform-wide settings managed by Mobigate Admin
// These settings are hidden from and cannot be modified by Community Admins

export interface PlatformWithdrawalSettings {
  minimumWithdrawal: number;        // Current minimum withdrawal amount in Mobi
  minimumWithdrawalMin: number;     // Slider minimum value
  minimumWithdrawalMax: number;     // Slider maximum value
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformWithdrawalSettings: PlatformWithdrawalSettings = {
  minimumWithdrawal: 10000,         // M10,000 (updated from M1,000)
  minimumWithdrawalMin: 1000,       // M1,000
  minimumWithdrawalMax: 50000,      // M50,000
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

// Function to get current minimum withdrawal (used by WalletWithdrawDialog)
export function getMinimumWithdrawal(): number {
  return platformWithdrawalSettings.minimumWithdrawal;
}

// Function to update minimum withdrawal (called from Mobigate Admin)
export function setMinimumWithdrawal(newMinimum: number): void {
  if (newMinimum >= platformWithdrawalSettings.minimumWithdrawalMin && 
      newMinimum <= platformWithdrawalSettings.minimumWithdrawalMax) {
    platformWithdrawalSettings.minimumWithdrawal = newMinimum;
    platformWithdrawalSettings.lastUpdatedAt = new Date();
  }
}

// Platform fee settings (for future expansion)
export interface PlatformFeeSettings {
  serviceChargeRate: number;        // Current service charge percentage
  serviceChargeMin: number;
  serviceChargeMax: number;
}

export const platformFeeSettings: PlatformFeeSettings = {
  serviceChargeRate: 20,            // 20% default
  serviceChargeMin: 15,
  serviceChargeMax: 30,
};
