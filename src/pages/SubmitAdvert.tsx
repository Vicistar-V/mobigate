import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload, Eye } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const advertCategories = [
  { value: "pictorial", label: "Pictorial/Photo Ads" },
  { value: "video", label: "Videos/Dynamic Ads" }
];

const advertTypes = [
  { value: "single", label: "Single Display" },
  { value: "multiple-2", label: "2-in-1 Multiple Displays" },
  { value: "multiple-3", label: "3-in-1 Multiple Displays" },
  { value: "multiple-4", label: "4-in-1 Multiple Displays" },
  { value: "multiple-5", label: "5-in-1 Multiple Displays" },
  { value: "multiple-6", label: "6-in-1 Multiple Displays" },
  { value: "multiple-7", label: "7-in-1 Multiple Displays" },
  { value: "multiple-8", label: "8-in-1 Multiple Displays" },
  { value: "multiple-9", label: "9-in-1 Multiple Displays" },
  { value: "multiple-10", label: "10-in-1 Multiple Displays" }
];

const advertSizes = [
  { value: "2x3", label: "2x3 - 1/5 Screen Height x Half Screen Width" },
  { value: "2x6", label: "2x6 - 1/5 Screen Height x Full Screen Width" },
  { value: "2.5x3", label: "2.5x3 - Quarter Screen Height x Half Screen Width" },
  { value: "2.5x6", label: "2.5x6 - Quarter Screen Height x Full Screen Width" },
  { value: "3.5x3", label: "3.5x3 - 1/3 Screen Height x Half Screen Width" },
  { value: "3.5x6", label: "3.5x6 - 1/3 Screen Height x Full Screen Width" },
  { value: "5x6", label: "5x6 - Half Screen Height x Full Screen Width" },
  { value: "6.5x3", label: "6.5x3 - 2/3 Screen Height x Half Screen Width" },
  { value: "6.5x6", label: "6.5x6 - 2/3 Screen Height x Full Screen Width" },
  { value: "10x6", label: "10x6 - Full Screen Height x Full Screen Width" }
];

const dpdPackages = [
  { value: "basic", label: "Basic: 100 DPD @ N1.5k/1,500 Mobi", dpd: 100, price: 1500 },
  { value: "standard", label: "Standard: 200 DPD @ N2.5k/2,500 Mobi", dpd: 200, price: 2500 },
  { value: "professional", label: "Professional: 300 DPD @ N5k/5,000 Mobi", dpd: 300, price: 5000 },
  { value: "business", label: "Business: 400 DPD @ N7.5k/7,500 Mobi", dpd: 400, price: 7500 },
  { value: "enterprise", label: "Enterprise: 500 DPD @ N10k/10,000 Mobi", dpd: 500, price: 10000 },
  { value: "entrepreneur", label: "Entrepreneur: 600 DPD @ N12.5k/12,500 Mobi", dpd: 600, price: 12500 },
  { value: "deluxe", label: "Deluxe: 700 DPD @ N15k/15,000 Mobi", dpd: 700, price: 15000 },
  { value: "deluxe-super", label: "Deluxe Super: 800 DPD @ N17.5k/17,500 Mobi", dpd: 800, price: 17500 },
  { value: "deluxe-super-plus", label: "Deluxe Super Plus: 900 DPD @ N20k/20,000 Mobi", dpd: 900, price: 20000 },
  { value: "deluxe-silver", label: "Deluxe Silver: 1,000 DPD @ N22.5k/22,500 Mobi", dpd: 1000, price: 22500 },
  { value: "deluxe-bronze", label: "Deluxe Bronze: 1,200 DPD @ N25k/25,000 Mobi", dpd: 1200, price: 25000 },
  { value: "deluxe-gold", label: "Deluxe Gold: 1,400 DPD @ N27.5k/27,500 Mobi", dpd: 1400, price: 27500 },
  { value: "deluxe-gold-plus", label: "Deluxe Gold Plus: 1,600 DPD @ N30k/30,000 Mobi", dpd: 1600, price: 30000 },
  { value: "deluxe-diamond", label: "Deluxe Diamond: 1,800 DPD @ N32.5k/32,500 Mobi", dpd: 1800, price: 32500 },
  { value: "deluxe-diamond-plus", label: "Deluxe Diamond Plus: 2,000 DPD @ N35k/35,000 Mobi", dpd: 2000, price: 35000 },
  { value: "deluxe-platinum", label: "Deluxe Platinum: 2,500 DPD @ N40k/40,000 Mobi", dpd: 2500, price: 40000 },
  { value: "deluxe-platinum-plus", label: "Deluxe Platinum Plus: 3,000 DPD @ N45k/45,000 Mobi", dpd: 3000, price: 45000 },
  { value: "bumper-gold", label: "Bumper Gold: 3,500 DPD @ N50k/50,000 Mobi", dpd: 3500, price: 50000 },
  { value: "bumper-diamond", label: "Bumper Diamond: 4,000 DPD @ N55k/55,000 Mobi", dpd: 4000, price: 55000 },
  { value: "bumper-platinum", label: "Bumper Platinum: 4,500 DPD @ N60k/60,000 Mobi", dpd: 4500, price: 60000 },
  { value: "bumper-infinity", label: "Bumper Infinity: 5,000 DPD @ N65k/65,000 Mobi", dpd: 5000, price: 65000 },
  { value: "unlimited", label: "Unlimited: Unlimited DPD @ N100k/100,000 Mobi", dpd: -1, price: 100000 }
];

const extendedExposure = [
  { value: "1", label: "Extra 1 minute @ Additional 12%", minutes: 1, charge: 12 },
  { value: "2", label: "Extra 2 minutes @ Additional 14%", minutes: 2, charge: 14 },
  { value: "3", label: "Extra 3 minutes @ Additional 16%", minutes: 3, charge: 16 },
  { value: "4", label: "Extra 4 minutes @ Additional 18%", minutes: 4, charge: 18 },
  { value: "5", label: "Extra 5 minutes @ Additional 20%", minutes: 5, charge: 20 },
  { value: "6", label: "Extra 6 minutes @ Additional 22%", minutes: 6, charge: 22 },
  { value: "7", label: "Extra 7 minutes @ Additional 24%", minutes: 7, charge: 24 },
  { value: "8", label: "Extra 8 minutes @ Additional 26%", minutes: 8, charge: 26 },
  { value: "9", label: "Extra 9 minutes @ Additional 28%", minutes: 9, charge: 28 },
  { value: "10", label: "Extra 10 minutes @ Additional 30%", minutes: 10, charge: 30 }
];

const recurrentExposureAfter = [
  { value: "10m", label: "Repeat after 10 minutes @ Additional 10%", time: "10 minutes", charge: 10 },
  { value: "30m", label: "Repeat after 30 minutes @ Additional 10%", time: "30 minutes", charge: 10 },
  { value: "1h", label: "Repeat after 1 hour @ Additional 10%", time: "1 hour", charge: 10 },
  { value: "3h", label: "Repeat after 3 hours @ Additional 10%", time: "3 hours", charge: 10 },
  { value: "6h", label: "Repeat after 6 hours @ Additional 10%", time: "6 hours", charge: 10 },
  { value: "12h", label: "Repeat after 12 hours @ Additional 10%", time: "12 hours", charge: 10 },
  { value: "18h", label: "Repeat after 18 hours @ Additional 10%", time: "18 hours", charge: 10 },
  { value: "24h", label: "Repeat after 24 hours @ Additional 10%", time: "24 hours", charge: 10 }
];

const recurrentExposureEvery = [
  { value: "10m", label: "Repeat every 10 minutes @ Additional 35%", time: "10 minutes", charge: 35 },
  { value: "30m", label: "Repeat every 30 minutes @ Additional 30%", time: "30 minutes", charge: 30 },
  { value: "1h", label: "Repeat every 1 hour @ Additional 25%", time: "1 hour", charge: 25 },
  { value: "3h", label: "Repeat every 3 hours @ Additional 20%", time: "3 hours", charge: 20 },
  { value: "6h", label: "Repeat every 6 hours @ Additional 15%", time: "6 hours", charge: 15 },
  { value: "12h", label: "Repeat every 12 hours @ Additional 12%", time: "12 hours", charge: 12 },
  { value: "18h", label: "Repeat every 18 hours @ Additional 10%", time: "18 hours", charge: 10 },
  { value: "24h", label: "Repeat every 24 hours @ Additional 9%", time: "24 hours", charge: 9 },
  { value: "30h", label: "Repeat every 30 hours @ Additional 8%", time: "30 hours", charge: 8 },
  { value: "36h", label: "Repeat every 36 hours @ Additional 7%", time: "36 hours", charge: 7 },
  { value: "42h", label: "Repeat every 42 hours @ Additional 6%", time: "42 hours", charge: 6 },
  { value: "48h", label: "Repeat every 48 hours @ Additional 5%", time: "48 hours", charge: 5 }
];

export default function SubmitAdvert() {
  const { toast } = useToast();
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [dpdPackage, setDpdPackage] = useState("");
  const [extendedExposureTime, setExtendedExposureTime] = useState("");
  const [recurrentAfter, setRecurrentAfter] = useState("");
  const [recurrentEvery, setRecurrentEvery] = useState("");
  const [launchDate, setLaunchDate] = useState<Date>();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Catchment market percentages
  const [ownCity, setOwnCity] = useState(20);
  const [ownState, setOwnState] = useState(25);
  const [ownCountry, setOwnCountry] = useState(25);
  const [foreignCountries, setForeignCountries] = useState(10);
  const [popularSearches, setPopularSearches] = useState(5);
  const [random, setRandom] = useState(5);
  const [others, setOthers] = useState(10);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
    }
  };

  const handlePreview = () => {
    toast({
      title: "Preview",
      description: "Opening advert preview...",
    });
  };

  const handlePublish = () => {
    if (!category || !type || !size || !dpdPackage) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Your advert has been submitted for admin approval",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Advert Subscription & Sign-Up Form</CardTitle>
            <CardDescription>
              Create and manage your premium advertisements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Category Selection */}
            <div className="space-y-2">
              <Label htmlFor="category">Select Category *</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Choose advert category" />
                </SelectTrigger>
                <SelectContent>
                  {advertCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="type">Select Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Choose display type" />
                </SelectTrigger>
                <SelectContent>
                  {advertTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <Label htmlFor="size">Select Size *</Label>
              <Select value={size} onValueChange={setSize}>
                <SelectTrigger id="size">
                  <SelectValue placeholder="Choose advert size" />
                </SelectTrigger>
                <SelectContent>
                  {advertSizes.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* DPD Package Selection */}
            <div className="space-y-2">
              <Label htmlFor="dpd">Select Daily Display Number (DPD) *</Label>
              <Select value={dpdPackage} onValueChange={setDpdPackage}>
                <SelectTrigger id="dpd">
                  <SelectValue placeholder="Choose DPD package" />
                </SelectTrigger>
                <SelectContent>
                  {dpdPackages.map((pkg) => (
                    <SelectItem key={pkg.value} value={pkg.value}>
                      {pkg.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Extended Exposure Duration */}
            <div className="space-y-2">
              <Label htmlFor="extended">Extended Exposure Duration (Optional)</Label>
              <Select value={extendedExposureTime} onValueChange={setExtendedExposureTime}>
                <SelectTrigger id="extended">
                  <SelectValue placeholder="Select extended exposure time" />
                </SelectTrigger>
                <SelectContent>
                  {extendedExposure.map((ext) => (
                    <SelectItem key={ext.value} value={ext.value}>
                      {ext.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recurrent Exposure - After */}
            <div className="space-y-2">
              <Label htmlFor="recurrent-after">Recurrent Exposure - Repeat After (Optional)</Label>
              <Select value={recurrentAfter} onValueChange={setRecurrentAfter}>
                <SelectTrigger id="recurrent-after">
                  <SelectValue placeholder="Select when to repeat" />
                </SelectTrigger>
                <SelectContent>
                  {recurrentExposureAfter.map((rec) => (
                    <SelectItem key={rec.value} value={rec.value}>
                      {rec.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Recurrent Exposure - Every */}
            <div className="space-y-2">
              <Label htmlFor="recurrent-every">Recurrent Exposure - Repeat Every (Optional)</Label>
              <Select value={recurrentEvery} onValueChange={setRecurrentEvery}>
                <SelectTrigger id="recurrent-every">
                  <SelectValue placeholder="Select repeat frequency" />
                </SelectTrigger>
                <SelectContent>
                  {recurrentExposureEvery.map((rec) => (
                    <SelectItem key={rec.value} value={rec.value}>
                      {rec.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Catchment/Target Markets */}
            <div className="space-y-4">
              <Label>Catchment/Target Markets</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="own-city" className="text-sm">Own City: {ownCity}%</Label>
                  <Input
                    id="own-city"
                    type="range"
                    min="0"
                    max="100"
                    value={ownCity}
                    onChange={(e) => setOwnCity(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="own-state" className="text-sm">Own State: {ownState}%</Label>
                  <Input
                    id="own-state"
                    type="range"
                    min="0"
                    max="100"
                    value={ownState}
                    onChange={(e) => setOwnState(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="own-country" className="text-sm">Own Country: {ownCountry}%</Label>
                  <Input
                    id="own-country"
                    type="range"
                    min="0"
                    max="100"
                    value={ownCountry}
                    onChange={(e) => setOwnCountry(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="foreign" className="text-sm">Foreign Countries: {foreignCountries}%</Label>
                  <Input
                    id="foreign"
                    type="range"
                    min="0"
                    max="100"
                    value={foreignCountries}
                    onChange={(e) => setForeignCountries(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="popular" className="text-sm">Popular Searches: {popularSearches}%</Label>
                  <Input
                    id="popular"
                    type="range"
                    min="0"
                    max="100"
                    value={popularSearches}
                    onChange={(e) => setPopularSearches(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="random" className="text-sm">Random: {random}%</Label>
                  <Input
                    id="random"
                    type="range"
                    min="0"
                    max="100"
                    value={random}
                    onChange={(e) => setRandom(Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="others" className="text-sm">Others: {others}%</Label>
                  <Input
                    id="others"
                    type="range"
                    min="0"
                    max="100"
                    value={others}
                    onChange={(e) => setOthers(Number(e.target.value))}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Total: {ownCity + ownState + ownCountry + foreignCountries + popularSearches + random + others}%
              </p>
            </div>

            {/* Launch Date */}
            <div className="space-y-2">
              <Label>Launch Ad On</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !launchDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {launchDate ? format(launchDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={launchDate}
                    onSelect={setLaunchDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <Label htmlFor="upload">Upload Advert Material *</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="upload"
                  type="file"
                  multiple
                  accept={category === "video" ? "video/*" : "image/*"}
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              {uploadedFiles.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {uploadedFiles.length} file(s) selected
                </p>
              )}
            </div>

            {/* Agreement */}
            <div className="flex items-center space-x-2">
              <Checkbox id="agree" />
              <Label htmlFor="agree" className="text-sm">
                I agree to the terms and conditions. My advert will be previewed and approved by the Admin before going live.
              </Label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="flex-1" onClick={handlePreview}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button className="flex-1" onClick={handlePublish}>
                Publish Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
