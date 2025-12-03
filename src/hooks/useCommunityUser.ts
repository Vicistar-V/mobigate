import { useState } from "react";

// Mock current user - in real app this would come from auth context
const MOCK_CURRENT_MEMBER_ID = "exec-3"; // Barr. Ngozi Okonkwo (Secretary-General)

export function useCommunityUser() {
  const [currentMemberId] = useState(MOCK_CURRENT_MEMBER_ID);

  const isOwnProfile = (memberId: string) => memberId === currentMemberId;

  return {
    currentMemberId,
    isOwnProfile,
  };
}
