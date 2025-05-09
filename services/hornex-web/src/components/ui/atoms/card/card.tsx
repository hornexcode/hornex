import classNames from 'classnames';

export type CardProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
};

const Card = ({ children, className, ...rest }: CardProps) => {
  return (
    <div
      className={classNames(
        'rounded-lg bg-light-dark shadow-card p-5 md:p-6',
        className,
      )}
      {...rest}
    >
      <div className="rounded-t-lg border-b border-dashed border-gray-600 pb-5 md:pb-6">
        <h4 className="font-bold tracking-tighter text-slate-300">
          {rest.title}
        </h4>
        {rest.subtitle && (
          <p className="text-xs font-medium text-slate-400">{rest.subtitle}</p>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default Card;
