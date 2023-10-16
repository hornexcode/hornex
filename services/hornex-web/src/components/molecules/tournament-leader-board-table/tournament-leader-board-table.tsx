import Scrollbar from '@/components/ui/scrollbar';
import { Tournament } from '@/lib/hx-app/types';
import { FC, useMemo } from 'react';

const COLUMNS = [
  {
    Header: '#',
    accessor: 'rank',
    // @ts-ignore
    Cell: ({ cell: { value } }) => <div>{value}</div>,
    minWidth: 40,
    maxWidth: 20,
  },
  {
    Header: () => <div className="">Team Name</div>,
    accessor: 'name',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="flex items-center gap-2">
        <div className="ltr:text-left rtl:text-left">{value}</div>
      </div>
    ),
    minWidth: 100,
  },
  {
    Header: () => <div className="">Score</div>,
    accessor: 'score',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="ltr:text-left rtl:text-left">{value}</div>
    ),
    minWidth: 80,
    maxWidth: 120,
  },

  {
    Header: () => <div className="">Details</div>,
    accessor: 'details',
    // @ts-ignore
    Cell: ({ cell: { value } }) => (
      <div className="ltr:text-left rtl:text-left">view details</div>
    ),
    minWidth: 100,
    maxWidth: 300,
  },
];

type TournamentStandingTabPanelProps = {};

const TournamentStandingTabPanel: FC<
  TournamentStandingTabPanelProps
> = ({}) => {
  const columns = useMemo(() => COLUMNS, []);

  return (
    <div className="relative z-20 flex flex-col overflow-hidden rounded-lg lg:flex-row">
      <div className="w-full transform transition duration-300 ease-in">
        <Scrollbar autoHide="never" style={{ width: '100%' }}>
          <div className="relative z-10">
            <table className="w-full border-separate border-0">
              <thead className="pricing-table-head dark:bg-light-dark grid px-[10px] text-sm text-gray-500 dark:text-gray-300 md:!px-6">
                <tr className="border-b border-dashed border-gray-700">
                  <th className="group px-3 py-5 font-normal first:!w-7">#</th>
                  <th className="group px-3 py-5 text-left font-normal">
                    Team Name
                  </th>
                  <th className="group px-3 py-5 font-normal"></th>
                </tr>
              </thead>

              <tbody className="pricing-table-body dark:bg-light-dark 3xl:text-sm grid bg-white text-xs  font-medium text-gray-900 dark:text-white md:px-6">
                <tr className="dark:bg-light-dark flex h-[50px] max-h-[50px] cursor-pointer items-center rounded uppercase transition-all last:mb-0 hover:bg-[#F3F4F6] hover:dark:bg-gray-700">
                  <td
                    className={`col-span-1 flex h-[50px] items-center px-3 tracking-[1px]`}
                  >
                    1
                  </td>
                  <td
                    className={`w-100 col-span-3 flex h-[50px] items-center px-3 tracking-[1px]`}
                  >
                    cell value
                  </td>
                  <td
                    className={`w-100 col-span-3 flex h-[50px] items-center px-3 tracking-[1px]`}
                  >
                    view details
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Scrollbar>
      </div>
    </div>
  );
};

export default TournamentStandingTabPanel;
