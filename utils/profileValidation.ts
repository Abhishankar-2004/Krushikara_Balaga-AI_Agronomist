import { UserProfile } from '../types';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate user profile data
 */
export const validateProfile = (profile: UserProfile): ValidationResult => {
  const errors: ValidationError[] = [];

  // Name validation
  if (!profile.name || profile.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (profile.name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  } else if (profile.name.trim().length > 50) {
    errors.push({ field: 'name', message: 'Name must be less than 50 characters' });
  } else if (!/^[a-zA-Z\s]+$/.test(profile.name.trim())) {
    errors.push({ field: 'name', message: 'Name can only contain letters and spaces' });
  }

  // Email validation (basic check since Clerk handles this)
  if (!profile.email || profile.email.trim().length === 0) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }

  // Location validation
  if (profile.location && profile.location.trim().length > 100) {
    errors.push({ field: 'location', message: 'Location must be less than 100 characters' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate agricultural metadata
 */
export const validateAgriculturalData = (data: {
  farmingType?: string;
  experienceLevel?: string;
  farmSize?: string;
}): ValidationResult => {
  const errors: ValidationError[] = [];

  const validFarmingTypes = ['crop', 'livestock', 'mixed', 'organic', 'dairy', 'poultry', 'horticulture', 'other'];
  const validExperienceLevels = ['beginner', 'intermediate', 'experienced', 'expert'];
  const validFarmSizes = ['small', 'medium', 'large', 'commercial'];

  // Farming type validation
  if (data.farmingType && !validFarmingTypes.includes(data.farmingType)) {
    errors.push({ field: 'farmingType', message: 'Please select a valid farming type' });
  }

  // Experience level validation
  if (data.experienceLevel && !validExperienceLevels.includes(data.experienceLevel)) {
    errors.push({ field: 'experienceLevel', message: 'Please select a valid experience level' });
  }

  // Farm size validation
  if (data.farmSize && !validFarmSizes.includes(data.farmSize)) {
    errors.push({ field: 'farmSize', message: 'Please select a valid farm size' });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Get field-specific error message
 */
export const getFieldError = (errors: ValidationError[], fieldName: string): string | null => {
  const error = errors.find(err => err.field === fieldName);
  return error ? error.message : null;
};

/**
 * Check if profile meets minimum requirements
 */
export const meetsMinimumRequirements = (profile: UserProfile): boolean => {
  return !!(
    profile.name && 
    profile.name.trim().length >= 2 && 
    profile.email && 
    profile.location && 
    profile.location.trim().length > 0
  );
};

/**
 * Get profile strength score (0-100)
 */
export const getProfileStrength = (profile: UserProfile, metadata?: any): number => {
  let score = 0;
  const maxScore = 100;

  // Basic fields (60 points total)
  if (profile.name && profile.name.trim().length >= 2) score += 20;
  if (profile.email) score += 20;
  if (profile.location && profile.location.trim().length > 0) score += 20;

  // Agricultural fields (40 points total)
  if (metadata?.farmingType) score += 15;
  if (metadata?.experienceLevel) score += 15;
  if (metadata?.farmSize) score += 10;

  return Math.round((score / maxScore) * 100);
};

export default {
  validateProfile,
  validateAgriculturalData,
  getFieldError,
  meetsMinimumRequirements,
  getProfileStrength
};