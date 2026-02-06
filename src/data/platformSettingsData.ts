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

// Platform Quiz Settings - Managed by Mobigate Admin
export interface PlatformQuizSettings {
  defaultTimePerQuestion: number;    // seconds
  timePerQuestionMin: number;
  timePerQuestionMax: number;
  partialWinPercentage: number;      // percentage
  partialWinMin: number;
  partialWinMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformQuizSettings: PlatformQuizSettings = {
  defaultTimePerQuestion: 10,
  timePerQuestionMin: 5,
  timePerQuestionMax: 60,
  partialWinPercentage: 20,
  partialWinMin: 10,
  partialWinMax: 50,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

// Function to get current quiz time per question
export function getDefaultTimePerQuestion(): number {
  return platformQuizSettings.defaultTimePerQuestion;
}

// Function to update quiz time per question
export function setDefaultTimePerQuestion(newTime: number): void {
  if (newTime >= platformQuizSettings.timePerQuestionMin && 
      newTime <= platformQuizSettings.timePerQuestionMax) {
    platformQuizSettings.defaultTimePerQuestion = newTime;
    platformQuizSettings.lastUpdatedAt = new Date();
  }
}

// Function to get current partial win percentage
export function getPartialWinPercentage(): number {
  return platformQuizSettings.partialWinPercentage;
}

// Function to update partial win percentage
export function setPartialWinPercentage(newPercentage: number): void {
  if (newPercentage >= platformQuizSettings.partialWinMin && 
      newPercentage <= platformQuizSettings.partialWinMax) {
    platformQuizSettings.partialWinPercentage = newPercentage;
    platformQuizSettings.lastUpdatedAt = new Date();
  }
}
