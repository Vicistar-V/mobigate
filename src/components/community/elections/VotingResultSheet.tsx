import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, X } from "lucide-react";
import { ElectionOffice, VoteRecord } from "@/data/electionData";
import { useState } from "react";

interface VotingResultSheetProps {
  office: ElectionOffice;
  voteRecords: VoteRecord[];
  onClose?: () => void;
  onDownload?: () => void;
}

export const VotingResultSheet = ({
  office,
  voteRecords,
  onClose,
  onDownload,
}: VotingResultSheetProps) => {
  const [sortFilter, setSortFilter] = useState("all");

  const getCandidateColorClass = (color: string) => {
    const colorMap = {
      green: "bg-green-500 text-white",
      purple: "bg-purple-600 text-white",
      magenta: "bg-pink-500 text-white",
      orange: "bg-orange-500 text-white",
      blue: "bg-blue-500 text-white",
    };
    return colorMap[color as keyof typeof colorMap] || "bg-gray-500 text-white";
  };

  const filteredRecords = voteRecords.filter((record) => {
    if (sortFilter === "all") return true;
    if (sortFilter === "women") return record.gender === "female";
    if (sortFilter === "men") return record.gender === "male";
    if (sortFilter === "anonymous") return record.isAnonymous;
    // For votes-for, votes-against, neutrals, we'd need additional logic based on vote data
    return true;
  });

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-lg font-bold">Voting Result Sheet</h3>
          <Select value={sortFilter} onValueChange={setSortFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="SORT VOTES" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Votes</SelectItem>
              <SelectItem value="votes-for">Votes For</SelectItem>
              <SelectItem value="votes-against">Votes Against</SelectItem>
              <SelectItem value="neutrals">Neutrals</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="anonymous">Anonymous</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>Office: {office.name} ({office.shortCode})</p>
          <p>Total Accredited Voters: {office.totalAccreditedVoters}</p>
        </div>

        {/* Horizontally Scrollable Table */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="min-w-[800px]">
            {/* Table Header */}
            <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(150px,1fr))] gap-1 mb-1">
              <div className="bg-muted p-2 rounded font-semibold text-sm sticky left-0 z-10">
                Voting/Voters for...
              </div>
              {office.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  className={`${getCandidateColorClass(candidate.color)} p-2 rounded font-semibold text-sm text-center`}
                >
                  {candidate.name}
                </div>
              ))}
            </div>

            {/* Performance Summary Row */}
            <div className="grid grid-cols-[200px_repeat(auto-fit,minmax(150px,1fr))] gap-1 mb-2">
              <div className="bg-muted p-2 rounded text-sm font-medium sticky left-0 z-10">
                Candidates' Performance
              </div>
              {office.candidates.map((candidate) => (
                <div key={candidate.id} className="bg-muted p-2 rounded text-sm text-center">
                  <div className="font-semibold">
                    {candidate.votes}|{candidate.losses}|{candidate.vct}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Votes|Loss|VCT
                  </div>
                </div>
              ))}
            </div>

            {/* Voter Rows */}
            <div className="space-y-1">
              {filteredRecords.map((record) => (
                <div
                  key={record.id}
                  className="grid grid-cols-[200px_repeat(auto-fit,minmax(150px,1fr))] gap-1"
                >
                  <div className="bg-background border p-2 rounded text-sm sticky left-0 z-10 flex items-center">
                    <span className="truncate">
                      + {record.voterName}
                      {record.isAnonymous && (
                        <span className="text-xs text-muted-foreground ml-1">(Anon)</span>
                      )}
                    </span>
                  </div>
                  {office.candidates.map((candidate) => {
                    const vote = record.votes.find((v) => v.candidateId === candidate.id);
                    return (
                      <div
                        key={candidate.id}
                        className="bg-background border p-2 rounded text-sm text-center"
                      >
                        {vote ? (
                          <>
                            <span className={vote.vote > 0 ? "font-semibold text-green-600" : ""}>
                              {vote.vote}
                            </span>
                            |
                            <span className={vote.loss > 0 ? "text-red-600" : ""}>
                              {vote.loss || "---"}
                            </span>
                            |{vote.vct}
                          </>
                        ) : (
                          "0|---|0"
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {filteredRecords.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No voting records found for the selected filter.
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end pt-4 border-t">
          <Button variant="outline" size="sm" onClick={onDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download Results
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
        </div>
      </div>
    </Card>
  );
};
