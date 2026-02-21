import { Header } from "@/components/Header";
import { InteractiveMerchantAdmin } from "@/components/mobigate/InteractiveMerchantAdmin";

export default function InteractiveMerchantsPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="p-4">
        <h1 className="text-lg font-bold mb-3">Interactive Quiz — Merchant Management</h1>
        <InteractiveMerchantAdmin />
      </div>
    </div>
  );
}
