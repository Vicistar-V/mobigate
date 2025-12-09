import { useState } from "react";
import { CommunityFormData, defaultCommunityFormData, OfficialPosition, MeetingSchedule, CommunityEvent } from "@/types/communityForm";
import { toast } from "@/hooks/use-toast";

const STORAGE_KEY = "mobigate-community-draft";

export interface SavedDraft {
  formData: CommunityFormData;
  completedSteps: number[];
  currentStep: number;
  savedAt: string;
}

export function useCommunityForm() {
  const [formData, setFormData] = useState<CommunityFormData>(defaultCommunityFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof CommunityFormData, string>>>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

  const updateField = <K extends keyof CommunityFormData>(
    field: K,
    value: CommunityFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addPosition = (position: OfficialPosition) => {
    setFormData(prev => ({
      ...prev,
      positions: [...prev.positions, position]
    }));
  };

  const removePosition = (positionId: string) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.filter(p => p.id !== positionId)
    }));
  };

  const updatePosition = (positionId: string, updates: Partial<OfficialPosition>) => {
    setFormData(prev => ({
      ...prev,
      positions: prev.positions.map(p => 
        p.id === positionId ? { ...p, ...updates } : p
      )
    }));
  };

  const addMeeting = (type: "general" | "executive" | "custom", meeting: MeetingSchedule) => {
    const field = type === "general" ? "generalMeetings" : type === "executive" ? "executiveMeetings" : "customMeetings";
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], meeting]
    }));
  };

  const removeMeeting = (type: "general" | "executive" | "custom", meetingId: string) => {
    const field = type === "general" ? "generalMeetings" : type === "executive" ? "executiveMeetings" : "customMeetings";
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(m => m.id !== meetingId)
    }));
  };

  const updateMeeting = (
    type: "general" | "executive" | "custom", 
    meetingId: string, 
    updates: Partial<MeetingSchedule>
  ) => {
    const field = type === "general" ? "generalMeetings" : type === "executive" ? "executiveMeetings" : "customMeetings";
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map(m => 
        m.id === meetingId ? { ...m, ...updates } : m
      )
    }));
  };

  const addEvent = (event: CommunityEvent) => {
    setFormData(prev => ({
      ...prev,
      events: [...prev.events, event]
    }));
  };

  const removeEvent = (eventId: string) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== eventId)
    }));
  };

  const updateEvent = (eventId: string, updates: Partial<CommunityEvent>) => {
    setFormData(prev => ({
      ...prev,
      events: prev.events.map(e => 
        e.id === eventId ? { ...e, ...updates } : e
      )
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof CommunityFormData, string>> = {};

    switch (step) {
      case 1: // Basics
        if (!formData.name.trim()) {
          newErrors.name = "Community name is required";
        }
        if (!formData.classification) {
          newErrors.classification = "Classification is required";
        }
        if (!formData.category) {
          newErrors.category = "Category is required";
        }
        // Designation is now system-assigned, no validation needed
        break;

      case 2: // Structure
        if (!formData.leadershipStyle) {
          newErrors.leadershipStyle = "Leadership style is required";
        }
        if (formData.populationStrength < 1) {
          newErrors.populationStrength = "Population strength must be at least 1";
        }
        if (formData.positions.length === 0) {
          newErrors.positions = "At least one position is required";
        }
        break;

      case 3: // Operations (no required fields)
        break;

      case 4: // Settings (no required fields)
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getStepErrors = (step: number): string[] => {
    const stepErrors: string[] = [];

    switch (step) {
      case 1:
        if (!formData.name.trim()) stepErrors.push("Community name is required");
        if (!formData.classification) stepErrors.push("Classification is required");
        if (!formData.category) stepErrors.push("Category is required");
        // Designation is system-assigned, no validation needed
        break;

      case 2:
        if (!formData.leadershipStyle) stepErrors.push("Leadership style is required");
        if (formData.populationStrength < 1) stepErrors.push("Population strength must be at least 1");
        if (formData.positions.length === 0) stepErrors.push("At least one position is required");
        break;

      case 3:
        break;

      case 4:
        break;
    }

    return stepErrors;
  };

  const isStepComplete = (step: number): boolean => {
    return getStepErrors(step).length === 0;
  };

  const markStepComplete = (step: number) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps(prev => [...prev, step]);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CommunityFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Community name is required";
    }
    if (!formData.classification) {
      newErrors.classification = "Classification is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    // Designation is system-assigned based on member count, no validation needed
    if (!formData.leadershipStyle) {
      newErrors.leadershipStyle = "Leadership style is required";
    }
    if (formData.populationStrength < 1) {
      newErrors.populationStrength = "Population strength must be at least 1";
    }
    if (formData.positions.length === 0) {
      newErrors.positions = "At least one position is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }

    // Here you would save to backend/localStorage
    console.log("Community Form Submitted:", formData);
    
    toast({
      title: "Community Created!",
      description: "Your community has been created successfully"
    });

    return true;
  };

  const resetForm = () => {
    setFormData(defaultCommunityFormData);
    setErrors({});
    setCompletedSteps([]);
    setLastSaved(null);
  };

  // Auto-save functionality
  const saveToStorage = (currentStep: number) => {
    try {
      const draft: SavedDraft = {
        formData,
        completedSteps,
        currentStep,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      setLastSaved(new Date());
      setHasSavedDraft(true);
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  };

  const loadFromStorage = (): SavedDraft | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const draft = JSON.parse(saved);
        setHasSavedDraft(true);
        return draft;
      }
      return null;
    } catch (error) {
      console.error("Failed to load draft:", error);
      return null;
    }
  };

  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHasSavedDraft(false);
      setLastSaved(null);
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  };

  const checkForSavedDraft = (): boolean => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const exists = !!saved;
      setHasSavedDraft(exists);
      return exists;
    } catch (error) {
      console.error("Failed to check for draft:", error);
      return false;
    }
  };

  const restoreFromDraft = (draft: SavedDraft) => {
    setFormData(draft.formData);
    setCompletedSteps(draft.completedSteps);
    setLastSaved(new Date(draft.savedAt));
    toast({
      title: "Draft Restored",
      description: "Your progress has been restored successfully"
    });
  };

  return {
    formData,
    errors,
    completedSteps,
    lastSaved,
    hasSavedDraft,
    updateField,
    addPosition,
    removePosition,
    updatePosition,
    addMeeting,
    removeMeeting,
    updateMeeting,
    addEvent,
    removeEvent,
    updateEvent,
    handleSubmit,
    resetForm,
    validateForm,
    validateStep,
    getStepErrors,
    isStepComplete,
    markStepComplete,
    saveToStorage,
    loadFromStorage,
    clearStorage,
    checkForSavedDraft,
    restoreFromDraft
  };
}
