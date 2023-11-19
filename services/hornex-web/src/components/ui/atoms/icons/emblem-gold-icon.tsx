import EmblemGold from '@/assets/images/ranked-emblem/emblem-gold.png';
import classnames from 'classnames';
import Image from 'next/image';

export const EmblemGoldIcon = ({ className }: { className?: string }) => {
  return (
    <div className={classnames(className)}>
      <Image src={EmblemGold} alt="gold emblem" />
    </div>
  );
};
