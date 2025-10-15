import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, FileText, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function ServiceUnavailable() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-3xl mx-auto px-4 py-8 flex-1">
        <Card className="p-6 sm:p-8">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-warning/10">
                <AlertCircle className="h-8 w-8 text-warning" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Service Unavailable</h1>
                <p className="text-base text-muted-foreground">Access Restricted</p>
              </div>
            </div>

            {/* Main Message */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Cannot Access This Service</AlertTitle>
              <AlertDescription className="mt-2">
                You cannot use this Service now: it's either you are not eligible to use 
                the Service, or this Service is not yet available in your country.
              </AlertDescription>
            </Alert>

            {/* Additional Information */}
            <div className="space-y-3">
              <p className="text-base text-muted-foreground">
                To learn more about service eligibility and availability in your region, 
                please review the following resources:
              </p>
              
              <div className="grid gap-3">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-3"
                  onClick={() => {
                    // Navigate to Terms (placeholder for now)
                    navigate("/");
                  }}
                >
                  <FileText className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Accessibility & Terms of Service</div>
                    <div className="text-sm text-muted-foreground">Learn about service eligibility</div>
                  </div>
                </Button>

                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-3"
                  onClick={() => {
                    // Navigate to Standards (placeholder for now)
                    navigate("/");
                  }}
                >
                  <Shield className="h-5 w-5 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Community Standards</div>
                    <div className="text-sm text-muted-foreground">View our community guidelines</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button 
                onClick={() => navigate(-1)}
                variant="outline"
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button 
                onClick={() => navigate("/")}
                className="gap-2"
              >
                Return to Home
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
