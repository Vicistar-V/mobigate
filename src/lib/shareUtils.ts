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

export const shareViaEmail = (subject: string, body: string): void => {
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
};

export const shareViaSMS = (body: string): void => {
  // Use ?& for cross-platform compatibility (iOS uses & Android uses ?)
  window.location.href = `sms:?&body=${encodeURIComponent(body)}`;
};

export const shareViaNative = async (title: string, text: string, url: string): Promise<boolean> => {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (err) {
      // User cancelled or error
      return false;
    }
  }
  return false;
};

export const shareToInstagram = async (url: string): Promise<boolean> => {
  // Instagram doesn't support direct web sharing, so copy link and open Instagram
  const copied = await copyToClipboard(url);
  window.open('https://www.instagram.com/', '_blank');
  return copied;
};
