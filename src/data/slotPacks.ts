import { SlotPack, SlotPackId } from "@/types/advert";

export const SLOT_PACKS: SlotPack[] = [
  {
    id: "entry",
    name: "Entry Slot Pack",
    minSlots: 1,
    maxSlots: 2,
    discountPercentage: 10,
    description: "Perfect for testing - 1-2 adverts with 10% discount"
  },
  {
    id: "basic",
    name: "Basic Slot Pack",
    minSlots: 3,
    maxSlots: 4,
    discountPercentage: 20,
    description: "Perfect for small campaigns - 3-4 adverts with 20% discount"
  },
  {
    id: "standard",
    name: "Standard Slot Pack",
    minSlots: 5,
    maxSlots: 7,
    discountPercentage: 25,
    description: "Popular choice - 5-7 adverts with 25% discount"
  },
  {
    id: "business",
    name: "Business Slot Pack",
    minSlots: 8,
    maxSlots: 10,
    discountPercentage: 30,
    description: "For growing businesses - 8-10 adverts with 30% discount"
  },
  {
    id: "enterprise",
    name: "Enterprise Slot Pack",
    minSlots: 11,
    maxSlots: 15,
    discountPercentage: 35,
    description: "Maximum impact - 11-15 adverts with 35% discount"
  }
];

export function getSlotPack(packId: SlotPackId): SlotPack | undefined {
  return SLOT_PACKS.find(pack => pack.id === packId);
}

export function validateSlotCount(packId: SlotPackId, slotCount: number): {
  isValid: boolean;
  needsUpgrade?: SlotPackId;
  message: string;
} {
  const pack = getSlotPack(packId);
  if (!pack) return { isValid: false, message: "Invalid pack" };

  if (slotCount < pack.minSlots) {
    return {
      isValid: false,
      message: `Minimum ${pack.minSlots} slots required for ${pack.name}`
    };
  }

  if (slotCount > pack.maxSlots) {
    // Find next pack
    const nextPack = SLOT_PACKS.find(p => p.minSlots > pack.maxSlots && slotCount <= p.maxSlots);
    return {
      isValid: false,
      needsUpgrade: nextPack?.id,
      message: `Maximum ${pack.maxSlots} slots for ${pack.name}. ${nextPack ? `Upgrade to ${nextPack.name}` : 'Exceeds maximum available'}`
    };
  }

  return { isValid: true, message: "Valid slot count" };
}
