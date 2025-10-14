export const generateShareUrl = (itemType: 'post' | 'ad', itemId: string): string => {
  const baseUrl = window.location.origin;
  return `${baseUrl}/${itemType}/${itemId}`;
};

export const shareToFacebook = (url: string, title: string): void => {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title)}`;
  window.open(facebookUrl, '_blank', 'width=600,height=400');
};

export const shareToTwitter = (url: string, title: string): void => {
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
  window.open(twitterUrl, '_blank', 'width=600,height=400');
};

export const shareToWhatsApp = (url: string, title: string): void => {
  const text = `${title} ${url}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank');
};

export const shareToLinkedIn = (url: string): void => {
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
  window.open(linkedInUrl, '_blank', 'width=600,height=400');
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
};
