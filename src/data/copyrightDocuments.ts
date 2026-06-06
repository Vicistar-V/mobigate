/**
 * data/copyrightDocuments.ts
 *
 * Copyright Documents submitted by authors against their accounts.
 *
 * LEGAL MODEL (enforced by PHP backend — represented here for the admin UI):
 *  - Documents are submitted to the System against the Author's Account.
 *  - Only Mobiface Admins can access/view these documents.
 *  - Authors cannot delete or remove them — even if the related post is deleted.
 *    They are legal documents that belong to Mobiface.
 *
 * The PHP backend can inject the real records via window.__COPYRIGHT_DOCUMENTS__
 * which overrides the demo data automatically.
 */

export type CopyrightDocStatus = "active" | "post-deleted";

export interface CopyrightDocument {
  id: string;
  authorId: string;
  authorName: string;
  authorEmail?: string;
  authorAvatar?: string;
  /** Related post (may be deleted — document is retained regardless) */
  postId?: string;
  postTitle?: string;
  postType?: "Video" | "Article" | "Photo" | "Audio" | "PDF" | "URL";
  /** Document file metadata */
  fileName: string;
  fileType: string; // e.g. "PDF", "PNG"
  fileSize: string; // human-readable, e.g. "1.2 MB"
  fileUrl?: string; // admin-only signed URL (PHP backend)
  submittedAt: string; // ISO date
  status: CopyrightDocStatus;
}

declare global {
  interface Window {
    __COPYRIGHT_DOCUMENTS__?: CopyrightDocument[];
  }
}

const demoDocuments: CopyrightDocument[] = [
  {
    id: "cpd-1",
    authorId: "1",
    authorName: "PETER NKEMJKA IPREC",
    authorEmail: "peter.iprec@example.com",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    postId: "post_1",
    postTitle: "AFROBEAT MUSIC PRODUCTION TUTORIAL",
    postType: "Video",
    fileName: "Facebook_1745067413464.pdf",
    fileType: "PDF",
    fileSize: "1.2 MB",
    submittedAt: "2025-05-18T18:31:00Z",
    status: "active",
  },
  {
    id: "cpd-2",
    authorId: "2",
    authorName: "SARAH OKAFOR",
    authorEmail: "sarah.okafor@example.com",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    postId: "post_2",
    postTitle: "BEAUTIFUL SUNSET PHOTOGRAPHY",
    postType: "Photo",
    fileName: "ownership_certificate.png",
    fileType: "PNG",
    fileSize: "740 KB",
    submittedAt: "2025-05-12T09:14:00Z",
    status: "active",
  },
  {
    id: "cpd-3",
    authorId: "5",
    authorName: "CHIEMERIE NWOSU",
    authorEmail: "chiemerie.n@example.com",
    authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    postId: undefined,
    postTitle: "ORIGINAL BEAT PACK VOL. 3",
    postType: "Audio",
    fileName: "studio_license_scan.tiff",
    fileType: "TIFF",
    fileSize: "3.4 MB",
    submittedAt: "2025-04-30T15:02:00Z",
    status: "post-deleted",
  },
];

export function getCopyrightDocuments(): CopyrightDocument[] {
  if (typeof window !== "undefined" && Array.isArray(window.__COPYRIGHT_DOCUMENTS__)) {
    return window.__COPYRIGHT_DOCUMENTS__;
  }
  return demoDocuments;
}
