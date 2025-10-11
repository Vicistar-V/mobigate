export type PrivacyLevel = "public" | "friends" | "family" | "followers" | "fans" | "all-except" | "only-me";
export type BirthdayPrivacy = "full" | "partial" | "hidden";

export interface PrivacySettings {
  level: PrivacyLevel;
  exceptions?: string[];
}

export interface PrivacyData {
  privacy: PrivacyLevel;
  exceptions?: string[];
}
