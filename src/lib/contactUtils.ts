/**
 * Utility functions for handling contact information in adverts
 */

import { ContactMethod } from "@/types/advert";

/**
 * Validates an email address
 * @param email The email to validate
 * @returns true if valid or empty, false otherwise
 */
export function validateEmail(email: string): boolean {
  if (!email || email.trim().length === 0) return true; // Optional field
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validates a URL
 * @param url The URL to validate
 * @returns true if valid or empty, false otherwise
 */
export function validateWebsiteUrl(url: string): boolean {
  if (!url || url.trim().length === 0) return true; // Optional field
  
  try {
    const urlObj = new URL(url.trim());
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Formats a URL to ensure it has a protocol
 * @param url The URL to format
 * @returns Formatted URL with protocol
 */
export function formatWebsiteUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  return `https://${trimmed}`;
}

/**
 * Validates a phone number (basic validation)
 * @param phone The phone number to validate
 * @returns true if valid, false otherwise
 */
export function validatePhoneNumber(phone: string): boolean {
  if (!phone || phone.trim().length === 0) return true; // Optional field
  
  // Remove spaces and non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Must start with + and have at least 10 digits
  const phoneRegex = /^\+\d{10,15}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Formats a phone number for URL usage (removes spaces and special chars except +)
 * @param phone The phone number to format
 * @returns Formatted phone number
 */
export function formatPhoneForUrl(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Generates a WhatsApp link with optional message
 * @param phone The phone number (should include country code with +)
 * @param message Optional pre-filled message
 * @returns WhatsApp web/app URL
 */
export function generateWhatsAppLink(phone: string, message?: string): string {
  const formattedPhone = formatPhoneForUrl(phone);
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : '';
  return `https://wa.me/${formattedPhone}${encodedMessage}`;
}

/**
 * Generates a phone call link
 * @param phone The phone number (should include country code with +)
 * @returns Tel protocol URL
 */
export function generateCallLink(phone: string): string {
  const formattedPhone = formatPhoneForUrl(phone);
  return `tel:${formattedPhone}`;
}

/**
 * Generates appropriate contact link based on method
 * @param phone The phone number
 * @param method The contact method (whatsapp or call)
 * @param message Optional message for WhatsApp
 * @returns Contact URL
 */
export function generateContactLink(
  phone: string,
  method: ContactMethod,
  message?: string
): string {
  if (!phone) return '#';
  
  return method === 'whatsapp' 
    ? generateWhatsAppLink(phone, message)
    : generateCallLink(phone);
}

/**
 * Gets display label for contact method
 * @param method The contact method
 * @returns User-friendly label
 */
export function getContactMethodLabel(method: ContactMethod): string {
  return method === 'whatsapp' ? 'WhatsApp' : 'Phone Call';
}
