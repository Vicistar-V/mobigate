import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronUp, Shield } from "lucide-react";

interface AnonymousVotingSectionProps {
  onSubmit?: (isAnonymous: boolean) => void;
}

export const AnonymousVotingSection = ({ onSubmit }: AnonymousVotingSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(isAnonymous);
    }
  };

  return (
    <Card className="mb-4 overflow-hidden">
      <div
        className="bg-red-500 text-white p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <span className="font-semibold">You can Vote as Anonymous!</span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5" />
        ) : (
          <ChevronDown className="w-5 h-5" />
        )}
      </div>

      {isOpen && (
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <p className="text-sm">
              Anonymous voting ensures your identity remains completely private. Your vote will be
              recorded and counted, but no one will be able to see who you voted for or that you
              participated anonymously.
            </p>

            <div className="bg-muted p-3 rounded-lg space-y-2">
              <h4 className="font-semibold text-sm">How it works:</h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>Your vote is encrypted and anonymized</li>
                <li>No connection between your identity and your vote</li>
                <li>Your participation is still counted in total votes</li>
                <li>Results remain accurate and verifiable</li>
              </ul>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
              />
              <label
                htmlFor="anonymous"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I want to vote anonymously
              </label>
            </div>
          </div>

          <Button
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
            onClick={handleSubmit}
          >
            Submit Your Vote
          </Button>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-900">
              <span className="font-semibold">Mobigate Guarantee:</span> Your privacy is our
              priority. We use industry-standard encryption to protect your voting data. Your
              anonymous vote cannot be traced back to you by anyone, including administrators.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};
