import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
          {/* 404 Number with gradient */}
          <div className="relative">
            <h1 className="text-[180px] sm:text-[240px] font-black leading-none bg-gradient-to-br from-primary via-accent to-primary bg-clip-text text-transparent animate-scale-in">
              404
            </h1>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-3xl -z-10" />
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Oops! The page you're looking for seems to have wandered off. 
              Let's get you back on track.
            </p>
          </div>

          {/* Search suggestion */}
          <div className="flex items-center justify-center gap-2 text-base text-muted-foreground bg-muted/50 rounded-lg px-4 py-3 max-w-md mx-auto">
            <Search className="h-4 w-4" />
            <span>Try searching or go back to the homepage</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Link to="/">
                <Home className="h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="gap-2 hover:bg-accent/50 transition-all duration-300"
              onClick={() => window.history.back()}
            >
              <button type="button">
                <ArrowLeft className="h-5 w-5" />
                Go Back
              </button>
            </Button>
          </div>

          {/* Decorative elements */}
          <div className="pt-8 grid grid-cols-3 gap-4 max-w-sm mx-auto opacity-50">
            <div className="h-2 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: "0ms" }} />
            <div className="h-2 bg-accent/20 rounded-full animate-pulse" style={{ animationDelay: "150ms" }} />
            <div className="h-2 bg-primary/20 rounded-full animate-pulse" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
