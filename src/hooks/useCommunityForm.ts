import { useState } from "react";
import { CommunityFormData, defaultCommunityFormData, OfficialPosition, MeetingSchedule } from "@/types/communityForm";
import { toast } from "@/hooks/use-toast";

export function useCommunityForm() {
  const [formData, setFormData] = useState<CommunityFormData>(defaultCommunityFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof CommunityFormData, string>>>({});

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

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CommunityFormData, string>> = {};

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
    updateField,
    addPosition,
    removePosition,
    updatePosition,
    addMeeting,
    removeMeeting,
    updateMeeting,
    handleSubmit,
    resetForm,
    validateForm
  };
}
