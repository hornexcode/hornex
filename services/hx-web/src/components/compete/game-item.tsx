import classNames from 'classnames';
import Image, { StaticImageData } from 'next/image';
import { FC } from 'react';

import Button from '@/components/ui/button/button';

type bgColorsType = {
  sky: string;
  purple: string;
  red: string;
  yellow: string;
};

const bgColors: bgColorsType = {
  sky: 'bg-sky-400/90',
  purple: 'bg-purple-400/80',
  red: 'bg-red-400/80',
  yellow: 'bg-yellow-400/80',
};

type PlatformIcon =
  | ((props: React.SVGAttributes<{}>) => JSX.Element)
  | React.ForwardRefExoticComponent<
      React.PropsWithoutRef<React.SVGProps<SVGSVGElement>> & {
        title?: string;
        titleId?: string;
      } & React.RefAttributes<SVGSVGElement>
    >;

export type GameItemProps = {
  bgImage: string;
  hoverImage: StaticImageData;
  LogoComponentIcon: (props: React.SVGAttributes<{}>) => JSX.Element;
  bgColor: keyof bgColorsType;
  platforms: {
    Icon: PlatformIcon;
    bgColor: string;
  }[];
  name: string;
  matchFormat: string;
  registeredPlayers: number;
  tournaments: number;
};

export const GameItem: FC<GameItemProps> = ({
  bgImage,
  LogoComponentIcon,
  hoverImage,
  bgColor,
  matchFormat,
  name,
  platforms,
  registeredPlayers,
  tournaments,
}) => (
  <div className="rounded bg-light-dark shadow-card">
    {/* tournament card header */}
    <div className="p-4">
      <div
        style={{
          background: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
        className={classNames(
          'group relative h-full w-full overflow-hidden rounded'
        )}
      >
        <div
          className={classNames(
            'absolute top-0 h-full w-full rounded opacity-70 transition-opacity duration-500 ease-linear',
            bgColors[bgColor]
          )}
        ></div>
        <div className="relative top-4 flex h-full flex-col items-center">
          <LogoComponentIcon className="mt-auto h-[3rem] fill-white" />
          <Image
            src={hoverImage}
            alt="Lol character"
            className="h-[10rem] w-auto transition-transform duration-500"
          />
        </div>
      </div>

      {/* tournament card body */}
      <div className="mt-4 block space-y-3 divide-y divide-slate-800">
        <div className="block">
          <span className="text-[11px] text-slate-200">
            {registeredPlayers} Tournaments opened
          </span>
          <h4 className="!font-display text-sm font-extrabold text-white">
            {name} - {matchFormat}
          </h4>
        </div>

        <div className="block pt-2">
          <div className="flex flex-col justify-between ">
            <p className="mb-2 text-xs">Platforms</p>
            <div className="flex flex-wrap items-center space-x-2">
              {platforms.map((platform, i) => (
                <platform.Icon
                  key={i}
                  className={classNames(
                    'w-7 rounded-md fill-white p-1',
                    platform.bgColor
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* tournament card footer */}
    <div className="rounded-b-lg border-t border-slate-700 bg-slate-800 p-4">
      <Button
        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-sm"
        shape="rounded"
        size="small"
      >
        Play Now
      </Button>
    </div>
  </div>
);
