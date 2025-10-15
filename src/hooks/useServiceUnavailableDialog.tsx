import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertCircle } from "lucide-react";

export const useServiceUnavailableDialog = () => {
  const [open, setOpen] = useState(false);

  const showDialog = () => setOpen(true);
  
  const Dialog = () => (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-warning" />
            <AlertDialogTitle>Service Unavailable</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              You cannot use this Service now: it's either you are not eligible to use 
              the Service, or this Service is not yet available in your country.
            </p>
            <p className="text-sm">
              You can find out more by going through Mobigate{" "}
              <span className="font-semibold">'ACCESSIBILITY & TERMS OF SERVICE'</span> and{" "}
              <span className="font-semibold">'COMMUNITY STANDARDS'</span>.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction>Understood</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return { showDialog, Dialog };
};
