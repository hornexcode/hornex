import { FC } from 'react';

export type PageHeaderProps = {
  title: string;
  description?: string;
};

export const PageHeader: FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div>
      <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-2xl">
        {title}
      </h1>
      {description && (
        <p className="leading-7 [&:not(:first-child)]:mt-6">{description}</p>
      )}
    </div>
  );
};
