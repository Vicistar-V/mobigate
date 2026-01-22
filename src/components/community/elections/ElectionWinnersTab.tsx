import { useState, useMemo } from "react";
import { Menu, Calendar, Filter, X, ChevronDown, Trophy } from "lucide-react";
import { WinnersView } from "./WinnersView";
import { PeopleYouMayKnow } from "@/components/PeopleYouMayKnow";
import { PremiumAdRotation } from "@/components/PremiumAdRotation";
import { mockElectionWinners } from "@/data/electionData";
import { getContentsAdsWithUserAdverts } from "@/data/profileAds";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { cn } from "@/lib/utils";

export const ElectionWinnersTab = () => {
  // Filter states
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [dateSelectionStep, setDateSelectionStep] = useState<'start' | 'end'>('start');
  const [isDatePopoverOpen, setIsDatePopoverOpen] = useState(false);
  const [officeFilter, setOfficeFilter] = useState<string>("all");
  const [electionTypeFilter, setElectionTypeFilter] = useState<string>("all");

  // Get unique offices and election types from data
  const offices = useMemo(() => {
    const uniqueOffices = [...new Set(mockElectionWinners.map(w => w.office))];
    return uniqueOffices.sort();
  }, []);

  const electionTypes = useMemo(() => {
    const uniqueTypes = [...new Set(mockElectionWinners.map(w => w.electionType))];
    return uniqueTypes;
  }, []);

  // Filter winners
  const filteredWinners = useMemo(() => {
    return mockElectionWinners.filter(winner => {
      // Date filter
      if (startDate && endDate) {
        const winnerDate = startOfDay(winner.announcedAt);
        const filterStart = startOfDay(startDate);
        const filterEnd = endOfDay(endDate);
        
        if (isBefore(winnerDate, filterStart) || isAfter(winnerDate, filterEnd)) {
          return false;
        }
      }

      // Office filter
      if (officeFilter !== "all" && winner.office !== officeFilter) {
        return false;
      }

      // Election type filter
      if (electionTypeFilter !== "all" && winner.electionType !== electionTypeFilter) {
        return false;
      }

      return true;
    });
  }, [startDate, endDate, officeFilter, electionTypeFilter]);

  const hasActiveFilters = startDate || endDate || officeFilter !== "all" || electionTypeFilter !== "all";

  const handleDateSelect = (date: Date | undefined) => {
    if (dateSelectionStep === 'start') {
      setStartDate(date);
      if (date) {
        setDateSelectionStep('end');
      }
    } else {
      if (date && startDate && isBefore(date, startDate)) {
        // If end date is before start date, swap them
        setEndDate(startDate);
        setStartDate(date);
      } else {
        setEndDate(date);
      }
      if (date) {
        setIsDatePopoverOpen(false);
        setDateSelectionStep('start');
      }
    }
  };

  const clearDateFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setDateSelectionStep('start');
  };

  const clearAllFilters = () => {
    clearDateFilter();
    setOfficeFilter("all");
    setElectionTypeFilter("all");
  };

  const getElectionTypeLabel = (type: string) => {
    switch (type) {
      case 'general':
        return 'General Election';
      case 'emergency':
        return 'Emergency Election';
      case 'by-election':
        return 'By-Election';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Menu className="w-5 h-5" />
          <h1 className="text-2xl font-bold">Election Winners</h1>
        </div>
      </div>

      {/* Filters Section */}
      <div className="space-y-3">
        {/* Filter Row */}
        <div className="flex flex-wrap gap-2">
          {/* Date Filter */}
          <Popover open={isDatePopoverOpen} onOpenChange={setIsDatePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={startDate && endDate ? "default" : "outline"}
                size="sm"
                className={cn(
                  "gap-2",
                  startDate && endDate && "bg-primary text-primary-foreground"
                )}
              >
                <Calendar className="h-4 w-4" />
                {startDate && endDate ? (
                  <span className="text-xs">
                    {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                  </span>
                ) : (
                  "Filter by Date"
                )}
                {startDate && endDate && (
                  <X
                    className="h-3 w-3 ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearDateFilter();
                    }}
                  />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="p-3 border-b">
                <div className="flex gap-2 mb-2">
                  <Button
                    variant={dateSelectionStep === 'start' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateSelectionStep('start')}
                    className="flex-1"
                  >
                    Start Date
                  </Button>
                  <Button
                    variant={dateSelectionStep === 'end' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDateSelectionStep('end')}
                    className="flex-1"
                    disabled={!startDate}
                  >
                    End Date
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {dateSelectionStep === 'start' 
                    ? 'Select start date' 
                    : startDate 
                      ? `From ${format(startDate, "MMM d, yyyy")} - Select end date`
                      : 'Select start date first'
                  }
                </p>
              </div>
              <CalendarComponent
                mode="single"
                selected={dateSelectionStep === 'start' ? startDate : endDate}
                onSelect={handleDateSelect}
                disabled={(date) => {
                  if (dateSelectionStep === 'end' && startDate) {
                    return isBefore(date, startDate);
                  }
                  return false;
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
              {(startDate || endDate) && (
                <div className="p-3 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearDateFilter}
                    className="w-full"
                  >
                    Clear Date Filter
                  </Button>
                </div>
              )}
            </PopoverContent>
          </Popover>

          {/* Office Filter */}
          <Select value={officeFilter} onValueChange={setOfficeFilter}>
            <SelectTrigger className={cn(
              "w-auto h-9 gap-2",
              officeFilter !== "all" && "bg-primary text-primary-foreground border-primary"
            )}>
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Office" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Offices</SelectItem>
              {offices.map(office => (
                <SelectItem key={office} value={office}>{office}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Election Type Filter */}
          <Select value={electionTypeFilter} onValueChange={setElectionTypeFilter}>
            <SelectTrigger className={cn(
              "w-auto h-9 gap-2",
              electionTypeFilter !== "all" && "bg-primary text-primary-foreground border-primary"
            )}>
              <Trophy className="h-4 w-4" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {electionTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {getElectionTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters & Results Count */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Showing {filteredWinners.length} of {mockElectionWinners.length} winners
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-xs text-muted-foreground"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Winners Content */}
      <WinnersView winners={filteredWinners} />

      {/* Ads */}
      <PremiumAdRotation ads={getContentsAdsWithUserAdverts().flat()} slotId="election-winners" />

      {/* People You May Know */}
      <PeopleYouMayKnow />
    </div>
  );
};
