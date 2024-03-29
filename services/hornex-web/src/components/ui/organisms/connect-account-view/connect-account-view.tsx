import InputLabel from '../../atoms/form/input-label';
import { LolFlatIcon } from '../../atoms/icons/lol-flat-icon';
import Listbox, { ListboxOption } from '../../atoms/list-box';
import RiotLogoFullBlackWhite from '@/assets/images/games/league-of-legends/riot-logo-full-black-white.png';
import { ArrowUpRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

const regionOptions: ListboxOption[] = [
  { name: 'Brasil', value: 'br1' },
  { name: 'North America', value: 'na1' },
  { name: 'North America', value: 'na1' },
];

const ConnectAccountView = () => {
  const [region, setRegion] = useState(regionOptions[0]);
  const router = useRouter();

  const returnPath = `return_path=${router.asPath}`;

  return (
    <div className="bg-dark rounded sm:w-[400px]">
      <div className="bg-medium-dark flex items-center rounded-t p-5">
        <LolFlatIcon className=" mr-4 h-12 w-12" />
        <div>
          <h4 className="text-title text-xl font-bold">Connect your account</h4>
        </div>
      </div>
      <div className="bg-light-dark p-5">
        <p className="text-title text-center text-lg font-medium">
          To register into tournaments you need to connect your account first.
        </p>
        <div className="flex justify-center py-10">
          <Image
            className="w-1/3"
            src={RiotLogoFullBlackWhite}
            alt="Riot Logo"
          />
        </div>
        <form className="space-y-4">
          {/* <div>
            <InputLabel title="Select your account region" important />
            <Listbox
              options={regionOptions}
              selectedOption={region}
              onChange={(option) => {
                setRegion(option);
              }}
            />
          </div> */}
          <div>
            <Link
              className="hightlight-white-20 text-dark flex w-full items-center justify-center rounded border border-amber-500 bg-amber-500 p-2 text-center font-bold"
              href={`/oauth/riot/login?${returnPath}`}
            >
              <span>Login to your account</span>
              <ArrowUpRightIcon className="ml-2 w-5" />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectAccountView;
