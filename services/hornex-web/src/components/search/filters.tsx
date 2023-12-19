import Collapse from '@/components/ui/atoms/collapse';
import { ChevronDown } from '@/components/ui/atoms/icons/chevron-down';
import { Listbox } from '@/components/ui/atoms/listbox';
import { RadioGroup } from '@/components/ui/atoms/radio-group';
import { Transition } from '@headlessui/react';
import Slider from 'rc-slider';
import { useState } from 'react';

export const sort = [
  { id: 1, name: 'Date Listed: Newest' },
  { id: 2, name: 'Date Listed: Oldest' },
  { id: 3, name: 'Ending: Soonest' },
  { id: 4, name: 'Ending: Latest' },
];

export function SortList() {
  const [selectedItem, setSelectedItem] = useState(sort[0]);
  return (
    <div className="relative">
      <Listbox value={selectedItem} onChange={setSelectedItem}>
        <Listbox.Button className="flex h-10 w-auto items-center justify-between rounded bg-gray-100 px-4 text-xs text-gray-900 dark:bg-gray-800 dark:text-white sm:w-56 sm:text-sm lg:h-11">
          {selectedItem.name}
          <ChevronDown className="ltr:ml-2 rtl:mr-2" />
        </Listbox.Button>
        <Transition
          enter="ease-out duration-200"
          enterFrom="opacity-0 translate-y-2"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 -translate-y-0"
          leaveTo="opacity-0 translate-y-2"
        >
          <Listbox.Options className="shadow-large dark:bg-light-dark absolute right-0 z-10 mt-2 w-56 origin-top-right rounded bg-white p-3 sm:w-full">
            {sort.map((item) => (
              <Listbox.Option key={item.id} value={item}>
                {({ selected }) => (
                  <div
                    className={`block cursor-pointer rounded px-3 py-2 text-xs font-medium text-gray-900 transition dark:text-white sm:text-sm  ${
                      selected
                        ? 'my-1 bg-gray-100 dark:bg-gray-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {item.name}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </Listbox>
    </div>
  );
}

export function PriceRange() {
  let [range, setRange] = useState({ min: 0, max: 1000 });
  function handleRangeChange(value: any) {
    setRange({
      min: value[0],
      max: value[1],
    });
  }
  function handleMaxChange(max: number) {
    setRange({
      ...range,
      max: max || range.min,
    });
  }
  function handleMinChange(min: number) {
    setRange({
      ...range,
      min: min || 0,
    });
  }
  return (
    <div className="p-5">
      <div className="mb-4 grid grid-cols-2 gap-2">
        <input
          className="h-9 rounded border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500"
          type="number"
          value={range.min}
          onChange={(e) => handleMinChange(parseInt(e.target.value))}
          min="0"
          max={range.max}
        />
        <input
          className="h-9 rounded border-gray-200 text-sm text-gray-900 outline-none focus:border-gray-900 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:focus:border-gray-500"
          type="number"
          value={range.max}
          onChange={(e) => handleMaxChange(parseInt(e.target.value))}
          min={range.min}
        />
      </div>
      <Slider
        range
        min={0}
        max={1000}
        value={[range.min, range.max]}
        allowCross={false}
        onChange={(value) => handleRangeChange(value)}
      />
    </div>
  );
}

export function Status() {
  let [plan, setPlan] = useState('buy-now');
  return (
    <RadioGroup
      value={plan}
      onChange={setPlan}
      className="grid grid-cols-2 gap-2 p-5"
    >
      <RadioGroup.Option value="buy-now">
        {({ checked }) => (
          <span
            className={`flex h-9 cursor-pointer items-center justify-center rounded border border-solid text-center text-sm font-medium uppercase tracking-wide transition-all ${
              checked
                ? 'border-brand bg-brand shadow-button text-white'
                : 'text-brand border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white'
            }`}
          >
            Buy Now
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="on-auction">
        {({ checked }) => (
          <span
            className={`flex h-9 cursor-pointer items-center justify-center rounded border border-solid text-center text-sm font-medium uppercase tracking-wide transition-all ${
              checked
                ? 'border-brand bg-brand shadow-button text-white'
                : 'text-brand border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white'
            }`}
          >
            On Auction
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="new">
        {({ checked }) => (
          <span
            className={`flex h-9 cursor-pointer items-center justify-center rounded border border-solid text-center text-sm font-medium uppercase tracking-wide transition-all ${
              checked
                ? 'border-brand bg-brand shadow-button text-white'
                : 'text-brand border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white'
            }`}
          >
            New
          </span>
        )}
      </RadioGroup.Option>
      <RadioGroup.Option value="has-offers">
        {({ checked }) => (
          <span
            className={`flex h-9 cursor-pointer items-center justify-center rounded border border-solid text-center text-sm font-medium uppercase tracking-wide transition-all ${
              checked
                ? 'border-brand bg-brand shadow-button text-white'
                : 'text-brand border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-white'
            }`}
          >
            Has offers
          </span>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
}

export function Filters() {
  return (
    <>
      <Collapse label="Status" initialOpen>
        <Status />
      </Collapse>
      <Collapse label="Price Range" initialOpen>
        <PriceRange />
      </Collapse>
    </>
  );
}
