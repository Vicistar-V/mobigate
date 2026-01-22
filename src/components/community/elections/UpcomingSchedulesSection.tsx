import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

export const UpcomingSchedulesSection = () => {
  const [activeTab, setActiveTab] = useState<'meetings' | 'events' | 'invitations'>('meetings');
  const [currentPage, setCurrentPage] = useState(0);
  
  const schedules = {
    meetings: [
      { name: 'General Meeting', date: 'Sat; Jan. 28, 2025' },
      { name: 'Exco Meeting', date: 'Sat; Jan. 21, 2025' },
      { name: 'General Meeting', date: 'Sat; Feb. 11, 2025' },
      { name: 'Executive Meeting', date: 'Mon; Feb. 17, 2025' },
      { name: 'General Meeting', date: 'Sat; Mar. 15, 2025' },
      { name: 'Exco Meeting', date: 'Sat; Mar. 22, 2025' },
      { name: 'General Meeting', date: 'Sat; Apr. 12, 2025' },
    ],
    events: [
      { name: 'Cultural Festival', date: 'Sun; Feb. 23, 2025' },
      { name: 'Annual Dinner', date: 'Sat; Mar. 08, 2025' },
      { name: 'Sports Day', date: 'Sat; Apr. 19, 2025' },
    ],
    invitations: [
      { name: 'Community Gathering', date: 'Fri; Jan. 31, 2025' },
      { name: 'Welcome Ceremony', date: 'Sat; Feb. 15, 2025' },
      { name: 'Award Presentation', date: 'Sun; Mar. 30, 2025' },
    ],
  };
  
  const itemsPerPage = 7;
  const currentSchedules = schedules[activeTab];
  const totalPages = Math.ceil(currentSchedules.length / itemsPerPage);
  const displayedSchedules = currentSchedules.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  
  return (
    <Card className="p-4">
      <div className="flex flex-col gap-1 mb-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg">Upcoming Meeting Schedules</h3>
          <Menu className="h-4 w-4" />
        </div>
        <span className="text-blue-600 font-semibold text-sm">Dates</span>
      </div>
      
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button 
          size="sm" 
          className={`h-auto py-2 px-3 whitespace-normal ${activeTab === 'meetings' ? 'bg-purple-800 hover:bg-purple-900' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          onClick={() => {
            setActiveTab('meetings');
            setCurrentPage(0);
          }}
        >
          Meetings
        </Button>
        <Button 
          size="sm" 
          className={`h-auto py-2 px-3 whitespace-normal ${activeTab === 'events' ? 'bg-purple-800 hover:bg-purple-900' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          onClick={() => {
            setActiveTab('events');
            setCurrentPage(0);
          }}
        >
          Events
        </Button>
        <Button 
          size="sm" 
          className={`h-auto py-2 px-3 whitespace-normal ${activeTab === 'invitations' ? 'bg-purple-800 hover:bg-purple-900' : 'bg-gray-200 text-black hover:bg-gray-300'}`}
          onClick={() => {
            setActiveTab('invitations');
            setCurrentPage(0);
          }}
        >
          Invitations
        </Button>
      </div>
      
      {/* Schedule list */}
      <div className="space-y-2">
        {displayedSchedules.map((schedule, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
            <span className="text-purple-700 font-semibold">{schedule.name}</span>
            <span className="text-sm text-muted-foreground">{schedule.date}</span>
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
