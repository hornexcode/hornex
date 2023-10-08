import Button from '@/components/ui/button/button';
import { SwordsIcon } from '@/components/ui/icons';
import { DiscordIcon } from '@/components/ui/icons/discord-icon';
import { Tournament } from '@/lib/hx-app/types';
import { CalendarIcon, TrophyIcon } from '@heroicons/react/20/solid';
import classnames from 'classnames';
import { ArrowBigRight, LampIcon, UsersIcon } from 'lucide-react';
import Image from 'next/image';
import { FC } from 'react';

type TournamentPageTemplateProps = {
  tournament?: Tournament;
};

const imageLoader = ({ src }: any) => {
  return `https://placehold.co/${src}`;
};

const TournamentPageTemplate: FC<TournamentPageTemplateProps> = ({}) => {
  return (
    <div className="grid grid-cols-12 gap-5 p-4">
      <div className="col-span-8">
        <div className="3xl:h-[448px] relative h-36 w-full overflow-hidden rounded-t-md sm:h-44 md:h-64 xl:h-72 2xl:h-96">
          <Image
            loader={imageLoader}
            src="1920x1080/232f48/jpg"
            // placeholder="blur"
            quality={100}
            width={1920}
            height={1080}
            className="!h-full w-full !object-cover"
            alt="Cover Image"
          />
        </div>
        <div className="bg-light-dark flex rounded-b-md p-4">
          <div className="flex w-full justify-between">
            <div className="block space-y-6">
              <div className="flex items-center space-x-2">
                <div className="rounded-md bg-slate-600 px-4 py-1 text-white">
                  league of legends
                </div>
                <div className="rounded-md bg-slate-600 px-4 py-1 text-white">
                  {/* <DiscordIcon className="h-4 w-4 fill-white" /> */}
                  5v5
                </div>
                <div className="rounded-md bg-slate-600 px-4 py-1 text-white">
                  32 times
                </div>
              </div>

              <div className="block">
                {/* headline */}
                <div className="flex items-center">
                  <CalendarIcon className="w-4" />
                  <div className="ml-2 text-sm">15 Jun, 2023 9:00h</div>
                </div>
                <h4 className="text-xl font-extrabold leading-5 -tracking-wide text-gray-200">
                  #1 summer tournament
                </h4>
                {/* classification */}
              </div>

              <div className="flex items-center">
                {/*  */}
                <div className="flex items-center space-x-4 border-r-2 border-dotted border-slate-700 pr-8">
                  <div>
                    <TrophyIcon className="w-7 fill-gray-400" />
                  </div>
                  <div>
                    <div className="text-md">Prize Pool</div>
                    <div className="text-lg text-white">R$ 2 000</div>
                  </div>
                </div>
                {/*  */}
                <div className="flex items-center space-x-4 border-r-2 border-dotted border-slate-700 px-8">
                  <div>
                    <SwordsIcon className="w-6 fill-gray-400" />
                  </div>
                  <div>
                    <div className="text-md">Classification</div>
                    <div className="text-lg text-white">
                      Silver I II III, Gold
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-40 self-start">
              <Button
                shape="rounded"
                className="w-full border dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                color="primary"
              >
                Jogar
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-5">
          <div className="col-span-1">
            <div className="bg-light-dark space-y-8 rounded-md p-4">
              <div className="block">
                <h4 className="text-2xl font-bold -tracking-wide text-white">
                  Info
                </h4>
              </div>
              <div className="block">
                <ol className="relative border-l border-gray-200 dark:border-gray-700">
                  <li className="mb-10 border-l pl-4 dark:border-green-400">
                    <div className="dark:border-light-dark absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border-2 border-white bg-gray-200 dark:bg-green-400"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                      February 2022
                    </time>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Registration
                    </h3>
                    <p className="mb-4 text-sm font-normal text-gray-500 dark:text-gray-400">
                      Register your team so you can get paid to play.
                    </p>

                    <div className="mb-4 block space-y-2">
                      <div className="col-span-2">
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <UsersIcon className="mr-1 h-5 w-4 " />
                            <span className="pr-4 text-xs font-bold text-white">
                              1/16
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <div className={classnames('flex w-full')}>
                          {Array.from({ length: 16 }).map((_, index) => (
                            <div
                              key={index}
                              className={classnames(
                                'flex-basis mr-1 h-2 flex-grow rounded-md  bg-green-400',
                                {
                                  'bg-gray-700': index > 4,
                                }
                              )}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <a
                      href="#"
                      className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:text-blue-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700"
                    >
                      Register{' '}
                      <svg
                        className="ml-2 h-3 w-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 10"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M1 5h12m0 0L9 1m4 4L9 9"
                        />
                      </svg>
                    </a>
                  </li>
                  <li className="mb-10 ml-4">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                      March 2022
                    </time>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Results tracking
                    </h3>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Coleta de dados
                    </p>
                  </li>
                  <li className="ml-4">
                    <div className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-white bg-gray-200 dark:border-gray-900 dark:bg-gray-700"></div>
                    <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                      April 2022
                    </time>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Payment
                    </h3>
                    <p className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      Lorem ipsum dolor sit.
                    </p>
                  </li>
                </ol>
              </div>
            </div>
          </div>
          <div className="col-span-3">
            <div className="bg-light-dark space-y-8 rounded-md p-4"></div>
          </div>
        </div>
      </div>
      <div className="grid-cols-5">
        <div className="bg-light-dark space-y-8 rounded-md p-4"></div>
      </div>
    </div>
  );
};

export default TournamentPageTemplate;
