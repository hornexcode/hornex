import { LOLTournament } from '@/lib/hx-app/types';
import Image from 'next/image';
import { FC } from 'react';

type TournamentDetailsTemplateProps = {
  tournament?: LOLTournament;
};

const imageLoader = ({ src }: any) => {
  return `https://placehold.co/${src}`;
};

const TournamentDetailsTemplate: FC<TournamentDetailsTemplateProps> = ({}) => {
  return (
    <div className="grid grid-cols-12 gap-5 p-4">
      <div className="col-span-7">
        <div className="3xl:h-[448px] relative h-36 w-full overflow-hidden rounded-t-md sm:h-44 md:h-64 xl:h-80 2xl:h-96">
          <Image
            loader={imageLoader}
            src="1920x1080/d3d3d3/jpg"
            // placeholder="blur"
            quality={100}
            width={1920}
            height={1080}
            className="!h-full w-full !object-cover"
            alt="Cover Image"
          />
        </div>
        <div className="bg-light-dark flex rounded-b-md p-4">
          <p>pedro</p>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetailsTemplate;
