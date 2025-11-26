import { useState } from "react";
import { CommunityFormData, defaultCommunityFormData, OfficialPosition, MeetingSchedule, CommunityEvent } from "@/types/communityForm";
import { toast } from "@/hooks/use-toast";

export function useCommunityForm() {
  const [formData, setFormData] = useState<CommunityFormData>(defaultCommunityFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof CommunityFormData, string>>>({});
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

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

  const addMeeting = (type: "general" | "executive", meeting: MeetingSchedule) => {
    const field = type === "general" ? "generalMeetings" : "executiveMeetings";
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], meeting]
    }));
  };

  const removeMeeting = (type: "general" | "executive", meetingId: string) => {
    const field = type === "general" ? "generalMeetings" : "executiveMeetings";
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter(m => m.id !== meetingId)
    }));
  };

  const updateMeeting = (
    type: "general" | "executive", 
    meetingId: string, 
    updates: Partial<MeetingSchedule>
  ) => {
    const field = type === "general" ? "generalMeetings" : "executiveMeetings";
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
        if (!formData.designation.trim()) {
          newErrors.designation = "Designation is required";
        }
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
        if (!formData.designation.trim()) stepErrors.push("Designation is required");
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
    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
    }
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
  };

  return {
    formData,
    errors,
    completedSteps,
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
    markStepComplete
  };
}
