import cn from 'classnames';

import ParamTab, { TabPanel } from '@/components/ui/param-tab';
// static data
import { useLayout } from '@/lib/hooks/use-layout';

const tabMenu = [
  {
    title: 'Members',
    path: 'members',
  },
  {
    title: 'Invites',
    path: 'invites',
  },
  {
    title: 'Match History',
    path: 'history',
  },
];

export function TeamTab() {
  return (
    <ParamTab tabMenu={tabMenu}>
      <TabPanel className="focus:outline-none">
        <div
          className={cn(
            'xs:grid-cols-2 3xl:grid-cols-3 4xl:grid-cols-4 grid gap-4 md:grid-cols-1 lg:grid-cols-2 lg:gap-5 xl:gap-6',
          )}
        >
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
            officia vel explicabo ut voluptatem deleniti totam deserunt illum
            laboriosam?
          </p>
        </div>
      </TabPanel>
      <TabPanel className="focus:outline-none">
        <div className="space-y-8 md:space-y-10 xl:space-y-12">
          <div className="3xl:grid-cols-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Labore
              cum, deserunt velit eaque eligendi debitis architecto quaerat
              voluptates beatae odit! Nulla?
            </p>
          </div>
          <div className="block">
            <h3 className="text-heading-style mb-3 uppercase text-gray-900 dark:text-white">
              Protocols
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi error repudiandae aperiam id assumenda. Quis facilis
                saepe, tempora laborum adipisci officiis? Praesentium!
              </p>
            </div>
          </div>
          <div className="block">
            <h3 className="text-heading-style mb-3 uppercase text-gray-900 dark:text-white">
              Networks
            </h3>
            <div className="3xl:grid-cols-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3">
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Excepturi. Quis facilis saepe, tempora laborum adipisci
                officiis? Praesentium!
              </p>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel className="focus:outline-none">
        <div className="space-y-8 xl:space-y-9">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi.
            Quis facilis saepe, tempora laborum adipisci officiis? Praesentium!
          </p>
        </div>
      </TabPanel>
    </ParamTab>
  );
}
