import classnames from "classnames";
import EmblemGold from "@/assets/images/ranked-emblem/emblem-gold.png";
import Image from "next/image";

export const EmblemGoldIcon = ({ className }: { className?: string }) => {
  return (
    <div className={classnames(className)}>
      <Image src={EmblemGold} alt="gold emblem" />
    </div>
  );
};
