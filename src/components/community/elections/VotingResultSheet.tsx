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

interface VoteBoxGroupProps {
  votes: number;
  loss: number | null | undefined;
  vct: number;
  colorClass?: string;
  showLabels?: boolean;
  isPerformance?: boolean;
}

const VoteBoxGroup = ({ votes, loss, vct, colorClass, showLabels, isPerformance }: VoteBoxGroupProps) => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex gap-0.5">
      <div className={`border-2 ${colorClass || 'border-gray-400'} ${isPerformance ? 'bg-white' : 'bg-white'} w-12 h-10 flex items-center justify-center ${isPerformance ? 'text-xl font-bold' : 'font-semibold text-sm'}`}>
        {votes}
      </div>
      <div className={`border-2 ${colorClass || 'border-gray-400'} ${isPerformance ? 'bg-white' : 'bg-white'} w-12 h-10 flex items-center justify-center ${isPerformance ? 'text-xl font-bold' : 'text-sm'}`}>
        {loss !== null && loss !== undefined && loss !== 0 ? loss : '---'}
      </div>
      <div className={`border-2 ${colorClass || 'border-gray-400'} ${isPerformance ? 'bg-white' : 'bg-white'} w-12 h-10 flex items-center justify-center ${isPerformance ? 'text-xl font-bold' : 'font-semibold text-sm'}`}>
        {vct}
      </div>
    </div>
    {showLabels && (
      <div className="flex w-full justify-around text-[10px] text-gray-600 font-medium px-0.5">
        <span>{isPerformance ? 'Votes' : 'Vote'}</span>
        <span>Loss</span>
        <span>VCT</span>
      </div>
    )}
  </div>
);

export const VotingResultSheet = ({
  office,
  voteRecords,
  onClose,
  onDownload,
}: VotingResultSheetProps) => {
  const [sortFilter, setSortFilter] = useState("all");

  const getCandidateColors = (index: number) => {
    const colors = [
      { header: "bg-green-600 text-white", border: "border-green-600" },
      { header: "bg-yellow-400 text-black", border: "border-yellow-500" },
      { header: "bg-pink-500 text-white", border: "border-pink-500" },
      { header: "bg-orange-500 text-white", border: "border-orange-500" },
      { header: "bg-blue-500 text-white", border: "border-blue-500" },
    ];
    return colors[index % colors.length];
  };

  const filteredRecords = voteRecords.filter((record) => {
    if (sortFilter === "all") return true;
    if (sortFilter === "women") return record.gender === "female";
    if (sortFilter === "men") return record.gender === "male";
    if (sortFilter === "anonymous") return record.isAnonymous;
    return true;
  });

  return (
    <Card className="p-4 mb-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-gray-200 px-3 py-1.5 font-bold text-sm border border-gray-400">
              Voting Result Sheet
            </div>
            <Select value={sortFilter} onValueChange={setSortFilter}>
              <SelectTrigger className="w-[140px] border-2 border-black font-bold">
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
        </div>

        {/* Horizontally Scrollable Table */}
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="min-w-[700px] border-collapse border-spacing-0">
            <thead>
              <tr>
                <th className="bg-pink-200 p-3 text-left min-w-[180px] sticky left-0 z-20 border border-gray-300">
                  <div className="text-sm leading-tight">
                    Voting/Voters for<br />
                    <span className="font-bold text-base">{office.name}</span> [{office.shortCode}] [{office.totalAccreditedVoters}]
                  </div>
                </th>
                {office.candidates.map((candidate, index) => {
                  const colors = getCandidateColors(index);
                  return (
                    <th
                      key={candidate.id}
                      className={`${colors.header} p-3 text-center min-w-[160px] border border-gray-300`}
                    >
                      <div className="text-sm font-bold leading-tight">
                        {candidate.name.split(' ').map((part, i) => (
                          <div key={i}>{part}</div>
                        ))}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {/* Performance Row */}
              <tr>
                <td className="bg-pink-200 p-3 font-bold sticky left-0 z-20 border border-gray-300">
                  <div className="text-sm leading-tight">
                    Candidates'<br />Performance
                  </div>
                </td>
                {office.candidates.map((candidate, index) => {
                  const colors = getCandidateColors(index);
                  return (
                    <td key={candidate.id} className="p-2 text-center border border-gray-300 bg-white">
                      <VoteBoxGroup
                        votes={candidate.votes}
                        loss={candidate.losses}
                        vct={candidate.vct}
                        colorClass={colors.border}
                        showLabels={true}
                        isPerformance={true}
                      />
                    </td>
                  );
                })}
              </tr>

              {/* Voter Rows */}
              {filteredRecords.map((record, recordIndex) => (
                <tr key={record.id}>
                  <td className="bg-pink-200 p-3 sticky left-0 z-20 border border-gray-300">
                    <div className="font-semibold text-sm">+ {record.voterName}</div>
                    <div className="text-xs text-gray-600 mt-0.5">{record.voterRegistration}</div>
                  </td>
                  {office.candidates.map((candidate) => {
                    const vote = record.votes.find((v) => v.candidateId === candidate.id);
                    return (
                      <td key={candidate.id} className="p-2 text-center border border-gray-300 bg-white">
                        <VoteBoxGroup
                          votes={vote?.vote || 0}
                          loss={vote?.loss}
                          vct={vote?.vct || 0}
                          showLabels={true}
                          isPerformance={false}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No voting records found for the selected filter.
            </div>
          )}

          {/* Scrolling Indicator */}
          <div className="text-xs text-gray-500 text-right mt-2 mr-2">
            More scrolling out →
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
