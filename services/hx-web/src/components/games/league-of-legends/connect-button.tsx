import classnames from 'classnames';
import { get } from 'es-cookie';
import { CheckCheckIcon, LoaderIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'react-toastify';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Input from '@/components/ui/form/input';
import Label from '@/components/ui/form/input-label';
import Listbox from '@/components/ui/list-box';
import Loader from '@/components/ui/loader';

import Button from '../../ui/button/button';

type Summoner = {
  accountId: string;
  name: string;
  profileIconId: number;
  puuid: string;
  revisionDate: number;
  summonerLevel: number;
};

const regionOptions = [
  {
    name: 'Select your region',
    value: '0',
  },
  {
    name: 'Brasil',
    value: 'br1',
  },
];

export const ConnectButton = () => {
  const [regionOption, setRegionOption] = useState(regionOptions[0]);
  const [isFetching, setIsFetching] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [summoner, setSummoner] = useState<Summoner>();
  const [summonerName, setSummonerName] = useState('');
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSearchSummoner = async () => {
    setIsFetching(true);
    setError(null);
    setIsValid(false);
    try {
      const res = await fetch(
        `http://localhost:9234/api/v1/lol/summoner/search?region=${regionOption.value}&summoner_name=${summonerName}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + get('hx-auth.token'),
          },
        },
      );
      const data = (await res.json()) as any;

      if (data?.error) {
        throw Error(data?.error);
      }

      setSummoner(data);
      setIsValid(true);
    } catch (error) {
      console.log(error);
      setError('Invalid summoner name');
    } finally {
      setIsFetching(false);
    }
  };

  const connectHandler = useCallback(async () => {
    setIsConnecting(true);
    try {
      const res = await fetch(
        `http://localhost:9234/api/v1/lol/summoner/connect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + get('hx-auth.token'),
          },
          body: JSON.stringify({
            ...summoner,
            region: regionOption.value,
          }),
        },
      );
      const data = (await res.json()) as any;

      if (data?.error) {
        throw Error(data?.error);
      }
      toast.success('Successfully connected!');
    } catch (error: any) {
      toast.error(error?.message);
      console.log(error);
    } finally {
      setIsConnecting(false);
    }
  }, [summoner, regionOption]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button shape="rounded" size="mini" color="secondary">
          Connect
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>League of Legends</DialogTitle>
          <DialogDescription>Connect your account</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="">
            <Label title="Select you account region" />
            <Listbox
              className="w-full"
              options={regionOptions}
              selectedOption={regionOption}
              onChange={setRegionOption}
            />
          </div>
          <div className="">
            <Label
              title="Summoner name"
              subTitle="Be aware that if you change your summoner name during a tournament you might not get paid in case you win"
            />
            <div className="relative">
              <Input
                value={summonerName}
                onChange={(e) => setSummonerName(e.target.value)}
                disabled={isFetching}
                inputClassName={classnames(
                  {
                    'ring-2 ring-green-500': isValid,
                  },
                  { 'ring-2 ring-red-500': error },
                )}
                onBlur={onSearchSummoner}
                name="summoner_name"
              />
              {isFetching && (
                <LoaderIcon className="absolute right-2 top-2 animate-spin text-slate-400" />
              )}
              {isValid && (
                <CheckCheckIcon className="absolute right-2 top-2 w-4 text-green-500" />
              )}
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
          </div>
        </div>
        <DialogFooter>
          <Button
            isLoading={isConnecting}
            onClick={connectHandler}
            disabled={!isValid}
            type="submit"
            shape="rounded"
            size="small"
            color="secondary"
          >
            Connect
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
