'use client';
import { menuItems } from './_menu-items';
import { ChevronDown } from '@/components/ui/icons/chevron-down';
import ActiveLink from '@/components/ui/links/active-link';
import { Menu } from '@/components/ui/menu';
import { Transition } from '@/components/ui/transition';
import routes from '@/config/routes';
import { Fragment } from 'react';

export default function MenuItems() {
  return (
    <div className="3xl:px-16 flex items-center xl:px-10 2xl:px-14">
      {menuItems.map((item, index) => (
        <Fragment key={item.name + index}>
          {item.dropdownItems ? (
            <div className="relative mx-4 first:ml-0 last:mr-0">
              <Menu>
                <Menu.Button className="flex items-center text-sm font-bold  text-gray-600 transition hover:text-gray-900 dark:text-white dark:hover:text-white">
                  {item.name}
                  <span className="z-[1] transition-transform duration-200 ltr:ml-3 rtl:mr-3">
                    <ChevronDown />
                  </span>
                </Menu.Button>
                <Transition
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4"
                  enterTo="opacity-100 translate-y-0"
                  leave="ease-in duration-300"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-4"
                >
                  <Menu.Items className="shadow-large absolute mt-5 w-64 origin-top-right rounded-lg bg-white p-3 ltr:right-0 rtl:left-0 dark:bg-gray-800">
                    {item.dropdownItems.map((dropDownItem, index) => (
                      <Menu.Item key={dropDownItem.name + index}>
                        <div>
                          <ActiveLink
                            href={{
                              pathname: routes.home + dropDownItem.href,
                            }}
                            className="block rounded-lg px-3 py-2 text-sm font-bold  !text-gray-600 transition hover:bg-gray-50 hover:text-gray-900 dark:!text-white dark:hover:bg-gray-700/50"
                            activeClassName="!bg-gray-100 dark:!bg-gray-700 my-1 last:mb-0 first:mt-0 !text-gray-900 dark:!text-white"
                          >
                            {dropDownItem.name}
                          </ActiveLink>
                        </div>
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          ) : (
            <ActiveLink
              href={{
                pathname: routes.home + (item.href !== '/' ? item.href : ''),
              }}
              className="3xl:mx-4 mx-3 text-[13px] font-bold  text-gray-600 transition first:ml-0 last:mr-0 hover:text-gray-900 dark:text-white dark:hover:text-white 2xl:mx-3 2xl:text-sm"
              activeClassName="!text-gray-900 dark:!text-white"
            >
              {item.name}
            </ActiveLink>
          )}
        </Fragment>
      ))}
    </div>
  );
}
