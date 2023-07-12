export interface TournamentCardAttrProps {
  icon: React.ReactNode;
  value: string;
  attr: string;
}

const TournamentCardAttr = ({ attr, icon, value }: TournamentCardAttrProps) => {
  return (
    <div className="block">
      <span className="text-[0.675rem]">{attr}</span>
      <div className="flex items-center space-x-1">
        {icon}
        <span className="text-xs text-white">{value}</span>
      </div>
    </div>
  );
};

export default TournamentCardAttr;
