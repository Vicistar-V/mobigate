// Platform-wide settings managed by Mobigate Admin
// These settings are hidden from and cannot be modified by Community Admins

export interface PlatformWithdrawalSettings {
  minimumWithdrawal: number;
  minimumWithdrawalMin: number;
  minimumWithdrawalMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformWithdrawalSettings: PlatformWithdrawalSettings = {
  minimumWithdrawal: 10000,
  minimumWithdrawalMin: 1000,
  minimumWithdrawalMax: 50000,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

export function getMinimumWithdrawal(): number {
  return platformWithdrawalSettings.minimumWithdrawal;
}

export function setMinimumWithdrawal(newMinimum: number): void {
  if (newMinimum >= platformWithdrawalSettings.minimumWithdrawalMin && 
      newMinimum <= platformWithdrawalSettings.minimumWithdrawalMax) {
    platformWithdrawalSettings.minimumWithdrawal = newMinimum;
    platformWithdrawalSettings.lastUpdatedAt = new Date();
  }
}

// Platform fee settings
export interface PlatformFeeSettings {
  serviceChargeRate: number;
  serviceChargeMin: number;
  serviceChargeMax: number;
}

export const platformFeeSettings: PlatformFeeSettings = {
  serviceChargeRate: 20,
  serviceChargeMin: 15,
  serviceChargeMax: 30,
};

// Platform Quiz Settings - Managed by Mobigate Admin
export interface PlatformQuizSettings {
  // Separate timers for objective and non-objective questions
  objectiveTimePerQuestion: number;     // seconds (default 10)
  objectiveTimeMin: number;
  objectiveTimeMax: number;
  nonObjectiveTimePerQuestion: number;  // seconds (default 15)
  nonObjectiveTimeMin: number;
  nonObjectiveTimeMax: number;
  partialWinPercentage: number;
  partialWinMin: number;
  partialWinMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformQuizSettings: PlatformQuizSettings = {
  objectiveTimePerQuestion: 10,
  objectiveTimeMin: 6,
  objectiveTimeMax: 10,
  nonObjectiveTimePerQuestion: 15,
  nonObjectiveTimeMin: 6,
  nonObjectiveTimeMax: 15,
  partialWinPercentage: 20,
  partialWinMin: 10,
  partialWinMax: 50,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

// Objective timer getters/setters
export function getObjectiveTimePerQuestion(): number {
  return platformQuizSettings.objectiveTimePerQuestion;
}

export function setObjectiveTimePerQuestion(newTime: number): void {
  if (newTime >= platformQuizSettings.objectiveTimeMin && 
      newTime <= platformQuizSettings.objectiveTimeMax) {
    platformQuizSettings.objectiveTimePerQuestion = newTime;
    platformQuizSettings.lastUpdatedAt = new Date();
  }
}

// Non-objective timer getters/setters
export function getNonObjectiveTimePerQuestion(): number {
  return platformQuizSettings.nonObjectiveTimePerQuestion;
}

export function setNonObjectiveTimePerQuestion(newTime: number): void {
  if (newTime >= platformQuizSettings.nonObjectiveTimeMin && 
      newTime <= platformQuizSettings.nonObjectiveTimeMax) {
    platformQuizSettings.nonObjectiveTimePerQuestion = newTime;
    platformQuizSettings.lastUpdatedAt = new Date();
  }
}

// Backward compatibility alias
export function getDefaultTimePerQuestion(): number {
  return getObjectiveTimePerQuestion();
}

export function setDefaultTimePerQuestion(newTime: number): void {
  setObjectiveTimePerQuestion(newTime);
}

// Partial win percentage
export function getPartialWinPercentage(): number {
  return platformQuizSettings.partialWinPercentage;
}

export function setPartialWinPercentage(newPercentage: number): void {
  if (newPercentage >= platformQuizSettings.partialWinMin && 
      newPercentage <= platformQuizSettings.partialWinMax) {
    platformQuizSettings.partialWinPercentage = newPercentage;
    platformQuizSettings.lastUpdatedAt = new Date();
  }
}

// Platform Question View Fee Settings
export interface PlatformQuestionViewSettings {
  questionViewFee: number;
  questionViewFeeMin: number;
  questionViewFeeMax: number;
  lastUpdatedAt: Date;
  lastUpdatedBy: string;
}

export const platformQuestionViewSettings: PlatformQuestionViewSettings = {
  questionViewFee: 2000,
  questionViewFeeMin: 500,
  questionViewFeeMax: 10000,
  lastUpdatedAt: new Date(),
  lastUpdatedBy: "Mobigate Admin",
};

export function getQuestionViewFee(): number {
  return platformQuestionViewSettings.questionViewFee;
}

export function setQuestionViewFee(newFee: number): void {
  if (newFee >= platformQuestionViewSettings.questionViewFeeMin && 
      newFee <= platformQuestionViewSettings.questionViewFeeMax) {
    platformQuestionViewSettings.questionViewFee = newFee;
    platformQuestionViewSettings.lastUpdatedAt = new Date();
  }
}
