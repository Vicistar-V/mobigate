import { SlotPackDraft, AdvertSlot, SlotPackId, AdvertFormData, AdvertPricing } from "@/types/advert";
import { SLOT_PACKS } from "@/data/slotPacks";

const PACK_DRAFT_KEY = "mobigate_slot_pack_draft";
const MOCK_USER_ID = "user-123";

export function createNewPackDraft(packId: SlotPackId): SlotPackDraft {
  const pack = SLOT_PACKS.find(p => p.id === packId);
  if (!pack) throw new Error("Invalid pack ID");

  const draft: SlotPackDraft = {
    id: `pack-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId: MOCK_USER_ID,
    packId,
    slots: [],
    status: "draft",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  savePackDraft(draft);
  return draft;
}

export function savePackDraft(draft: SlotPackDraft): void {
  try {
    localStorage.setItem(PACK_DRAFT_KEY, JSON.stringify(draft));
  } catch (error) {
    console.error("Failed to save pack draft:", error);
  }
}

export function loadPackDraft(): SlotPackDraft | null {
  try {
    const data = localStorage.getItem(PACK_DRAFT_KEY);
    if (!data) return null;

    const draft = JSON.parse(data);
    return {
      ...draft,
      createdAt: new Date(draft.createdAt),
      updatedAt: new Date(draft.updatedAt),
      slots: draft.slots.map((slot: any) => ({
        ...slot,
        createdAt: new Date(slot.createdAt),
        updatedAt: new Date(slot.updatedAt)
      }))
    };
  } catch (error) {
    console.error("Failed to load pack draft:", error);
    return null;
  }
}

export function addSlotToPack(
  draft: SlotPackDraft,
  formData: AdvertFormData,
  pricing: AdvertPricing
): SlotPackDraft {
  const newSlot: AdvertSlot = {
    id: `slot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    slotNumber: draft.slots.length + 1,
    formData,
    pricing,
    status: "filled",
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const updatedDraft = {
    ...draft,
    slots: [...draft.slots, newSlot],
    updatedAt: new Date()
  };

  savePackDraft(updatedDraft);
  return updatedDraft;
}

export function updateSlotInPack(
  draft: SlotPackDraft,
  slotId: string,
  formData: AdvertFormData,
  pricing: AdvertPricing
): SlotPackDraft {
  const updatedDraft = {
    ...draft,
    slots: draft.slots.map(slot =>
      slot.id === slotId
        ? { ...slot, formData, pricing, updatedAt: new Date() }
        : slot
    ),
    updatedAt: new Date()
  };

  savePackDraft(updatedDraft);
  return updatedDraft;
}

export function deleteSlotFromPack(draft: SlotPackDraft, slotId: string): SlotPackDraft {
  const updatedDraft = {
    ...draft,
    slots: draft.slots
      .filter(slot => slot.id !== slotId)
      .map((slot, index) => ({ ...slot, slotNumber: index + 1 })),
    updatedAt: new Date()
  };

  savePackDraft(updatedDraft);
  return updatedDraft;
}

export function calculatePackTotal(draft: SlotPackDraft): {
  subtotal: number;
  packDiscount: number;
  finalTotal: number;
} {
  const subtotal = draft.slots.reduce((sum, slot) => {
    return sum + (slot.pricing.finalAmountPayable || slot.pricing.totalCost);
  }, 0);

  const pack = SLOT_PACKS.find(p => p.id === draft.packId);
  const packDiscountAmount = pack ? (subtotal * pack.discountPercentage / 100) : 0;
  const finalTotal = subtotal - packDiscountAmount;

  return {
    subtotal,
    packDiscount: packDiscountAmount,
    finalTotal
  };
}

export function clearPackDraft(): void {
  localStorage.removeItem(PACK_DRAFT_KEY);
}

export function canPublishPack(draft: SlotPackDraft): boolean {
  const pack = SLOT_PACKS.find(p => p.id === draft.packId);
  return pack ? draft.slots.length >= pack.minSlots : false;
}
