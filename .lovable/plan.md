

## Plan: Replace `window.print()` with PDF Download for Mobile

### Root Cause
`window.print()` on Android Chrome consistently produces blank pages regardless of off-screen positioning tricks. The browser's print engine doesn't reliably render dynamically injected DOM content on mobile. This is a known Chrome Android limitation.

### Solution
Replace `window.print()` with **jsPDF + html2canvas** PDF generation. Both libraries are already installed (`package.json` lines 49-51) and used successfully elsewhere in the project (OfficialLetterDisplay, DigitalIDCardDisplay, CertificateOfReturnDisplay). The PDF will be downloaded directly — no blank print preview.

### Changes (3 files)

**1. `src/components/merchant/VoucherExportDrawer.tsx` — Voucher card printing**
- Replace the `handlePrint` function's `window.print()` approach with:
  - Create the print container as a visible (but off-screen) React-rendered div
  - Use `html2canvas` to capture it, then `jsPDF` to create a multi-page A4 PDF
  - Call `pdf.save("voucher-cards.pdf")` instead of `window.print()`
  - Clean up the container and call `onPrintComplete` after save
- Import `html2canvas` and `jsPDF`

**2. `src/pages/MerchantVoucherGenerate.tsx` — Receipt printing**
- Replace `handlePrintReceipt`'s `window.print()` with html2canvas → jsPDF → `pdf.save("receipt.pdf")`
- Same pattern: create off-screen div, capture, generate PDF, clean up

**3. `src/pages/SubMerchantBuyVouchers.tsx` — Receipt printing**
- Same change as MerchantVoucherGenerate

### Pattern (applied to all files)
```typescript
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Inside the print handler:
document.body.appendChild(printContainer);

// Wait for rendering
await new Promise(r => setTimeout(r, 300));

const canvas = await html2canvas(printContainer, {
  scale: 2,
  backgroundColor: "#ffffff",
  useCORS: true,
  logging: false,
});

const imgData = canvas.toDataURL("image/png");
const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
const pageWidth = pdf.internal.pageSize.getWidth();
const pageHeight = pdf.internal.pageSize.getHeight();
const padding = 10;
const availableWidth = pageWidth - padding * 2;
const ratio = availableWidth / canvas.width;
const scaledHeight = canvas.height * ratio;

// Multi-page support
let heightLeft = scaledHeight;
let position = padding;
pdf.addImage(imgData, "PNG", padding, position, availableWidth, scaledHeight);
heightLeft -= (pageHeight - padding * 2);

while (heightLeft > 0) {
  pdf.addPage();
  position = padding - (scaledHeight - heightLeft);
  pdf.addImage(imgData, "PNG", padding, position, availableWidth, scaledHeight);
  heightLeft -= (pageHeight - padding * 2);
}

pdf.save("voucher-cards.pdf");
document.body.removeChild(printContainer);
```

### Why This Works
- Bypasses Android Chrome's broken `window.print()` entirely
- Uses the exact same approach already proven in the project's certificate/ID card/letter downloads
- User gets a PDF file they can print from their file manager or share directly
- Works on all platforms (Android, iOS, desktop)

### Global CSS
- The `@media print` rules in `index.css` can remain as-is (harmless fallback) — no changes needed there

