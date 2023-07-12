import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { FC } from "react";

type ChoseGameCardProps = {
  bgImage: string;
  hoverImage: StaticImageData;
  LogoComponentIcon: (props: React.SVGAttributes<{}>) => JSX.Element;
};

export const ChoseGameCard: FC<ChoseGameCardProps> = ({
  bgImage,
  LogoComponentIcon,
  hoverImage
}) => (
  <Link
    href={""}
    className={
      "group relative h-full min-h-[20rem] w-full min-w-[18rem] overflow-hidden rounded-lg bg-red-500" +
      " bg-[url('" +
      bgImage +
      "')] " +
      "bg-cover bg-no-repeat"
    }
  >
    <div className="absolute top-0 h-full w-full rounded-md bg-red-500 opacity-100 transition-opacity duration-500 ease-linear group-hover:opacity-70"></div>
    <div className="relative flex h-full flex-col">
      <LogoComponentIcon className="mx-auto mt-auto max-w-[40%] fill-white" />
      <Image
        src={hoverImage}
        alt="Lol character"
        className="mx-auto mb-4 mt-auto min-w-[80%] transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute bottom-0 min-h-[38%] w-full bg-gradient-to-t from-transparent via-red-500 to-transparent"></div>
      <figcaption className="absolute bottom-0 flex w-full items-center justify-center bg-red-800 p-5">
        <span className="text-sm font-bold leading-4 tracking-tight text-white">
          Play Now
        </span>
      </figcaption>
    </div>
  </Link>
);
