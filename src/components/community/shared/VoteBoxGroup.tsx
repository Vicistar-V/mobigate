interface VoteBoxGroupProps {
  values: (number | string | null)[];
  labels: string[];
  colorClass?: string;
  isLarge?: boolean;
}

export const VoteBoxGroup = ({ 
  values, 
  labels, 
  colorClass = "border-gray-300", 
  isLarge = false 
}: VoteBoxGroupProps) => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-0.5">
        {values.map((value, index) => (
          <div 
            key={index}
            className={`border-2 ${colorClass} w-10 h-8 flex items-center justify-center ${
              isLarge ? 'text-lg font-bold' : 'font-semibold'
            } ${value !== null && value !== '---' ? '' : 'text-gray-400'}`}
          >
            {value !== null && value !== undefined ? value : '---'}
          </div>
        ))}
      </div>
      <div className="flex w-full justify-around text-[10px] text-muted-foreground mt-0.5">
        {labels.map((label, index) => (
          <span key={index}>{label}</span>
        ))}
      </div>
    </div>
  );
};