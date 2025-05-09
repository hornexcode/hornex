import EmblemSilver from '@/assets/images/ranked-emblem/emblem-silver.png';
import classnames from 'classnames';
import Image from 'next/image';

export const EmblemSilverIcon = ({ className }: { className?: string }) => {
  return (
    <div className={classnames(className)}>
      <Image src={EmblemSilver} alt="gold emblem" />
    </div>
  );
};
