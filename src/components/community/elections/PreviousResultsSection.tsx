import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export const PreviousResultsSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const results = [
    { type: 'General Election', date: 'Sat; Jan. 28, 2025' },
    { type: 'General Election', date: 'Sat; Jan. 18, 2021' },
    { type: 'General Election', date: 'Sat; Jan. 24, 2017' },
    { type: 'Ad-hoc Committee', date: 'Mon; Mar. 15, 2024' },
    { type: 'General Election', date: 'Sat; Feb. 10, 2018' },
  ];
  
  const itemsPerPage = 3;
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const displayedResults = results.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-lg">Previous Election<br/>Results</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-blue-600 font-semibold">Dates</span>
          <Menu className="h-4 w-4" />
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className="font-semibold bg-gray-200 px-3 py-1 rounded">Chat Messages</span>
        <span className="text-blue-600 underline cursor-pointer hover:text-blue-800">
          Download Meeting Chat
        </span>
      </div>
      
      <div className="space-y-2">
        {displayedResults.map((result, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
            <span className="text-purple-700 font-semibold">{result.type}</span>
            <span className="text-sm text-muted-foreground">{result.date}</span>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 pt-3 border-t">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="font-bold">
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
          disabled={currentPage === totalPages - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
