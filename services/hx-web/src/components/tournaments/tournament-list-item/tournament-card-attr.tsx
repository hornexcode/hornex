import classnames from 'classnames';

type SizeNames = 'medium' | 'small';

export interface TournamentCardAttrProps {
  icon: React.ReactNode;
  value: string;
  attr: string;
  size: SizeNames;
}

const sizes: Record<SizeNames, string[]> = {
  medium: ['text-sm'],
  small: ['text-xs'],
};

const TournamentCardAttr = ({
  attr,
  icon,
  value,
  size,
}: TournamentCardAttrProps) => {
  const sizeClassNames = sizes[size];

  return (
    <div className="block">
      <span className={classnames(sizeClassNames)}>{attr}</span>
      <div className="flex items-center space-x-1 font-display">
        {icon}
        <span
          className={classnames('font-bold text-white', {
            'text-xs': size == 'small',
            'text-md': size == 'medium',
          })}
        >
          {value}
        </span>
      </div>
    </div>
  );
};

export default TournamentCardAttr;
