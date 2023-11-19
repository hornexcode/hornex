import Button from '@/components/ui/atoms/button';
import { ChevronDown } from '@/components/ui/atoms/icons/chevron-down';
import { LongArrowLeft } from '@/components/ui/atoms/icons/long-arrow-left';
import { LongArrowRight } from '@/components/ui/atoms/icons/long-arrow-right';
import Scrollbar from '@/components/ui/atoms/scrollbar';
import React, { useState } from 'react';
import {
  useFlexLayout,
  useGlobalFilter,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from 'react-table';

function TeamLeaderBoardTable({
  // @ts-ignore
  columns,
  // @ts-ignore
  data,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state,
    setGlobalFilter,
    headerGroups,
    page,
    nextPage,
    previousPage,
    prepareRow,
  } = useTable(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
      initialState: { pageSize: 17 },
    },
    useGlobalFilter,
    useSortBy,
    useResizeColumns,
    useFlexLayout,
    usePagination
  );
  const { pageIndex } = state;
  const { globalFilter } = state;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative z-20 flex flex-col overflow-hidden rounded-lg lg:flex-row">
      <div className="w-full transform transition duration-300 ease-in">
        <div className="shadow-card -mx-0.5 dark:[&_.os-scrollbar_.os-scrollbar-track_.os-scrollbar-handle:before]:!bg-white/50">
          <Scrollbar style={{ width: '100%' }} autoHide="never">
            <div className="relative z-10">
              <table
                {...getTableProps()}
                className="-mt-[2px] w-full border-separate border-0"
              >
                <thead className="pricing-table-head dark:bg-light-dark block bg-white px-[10px] text-sm text-gray-500 dark:text-gray-300 md:!px-6">
                  {headerGroups.map((headerGroup, idx) => (
                    <tr
                      {...headerGroup.getHeaderGroupProps()}
                      key={idx}
                      className="border-b border-dashed border-gray-200 dark:border-gray-700"
                    >
                      {headerGroup.headers.map((column, idx) => (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          key={idx}
                          className={`group px-3 py-5 font-normal first:!w-7`}
                        >
                          <div className="flex items-center">
                            {column.render('Header')}
                            {column.canResize && (
                              <div
                                {...column.getResizerProps()}
                                className={`resizer ${
                                  column.isResizing ? 'isResizing' : ''
                                }`}
                              />
                            )}
                            <span className="ltr:ml-1 rtl:mr-1">
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <ChevronDown />
                                ) : (
                                  <ChevronDown className="rotate-180" />
                                )
                              ) : (
                                <ChevronDown className="rotate-180 opacity-0 transition group-hover:opacity-50" />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody
                  {...getTableBodyProps()}
                  className="pricing-table-body dark:bg-light-dark 3xl:text-sm grid bg-white text-xs  font-medium text-gray-900 dark:text-white md:px-6"
                >
                  {page.map((row, idx) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        key={idx + 1}
                        className="dark:bg-light-dark h-[50px] max-h-[50px] cursor-pointer items-center rounded uppercase transition-all last:mb-0 hover:bg-[#F3F4F6] hover:dark:bg-gray-700"
                        onClick={() => setIsOpen(!isOpen)}
                      >
                        {row.cells.map((cell, idx) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              key={idx}
                              className={`flex h-[50px] items-center px-3 tracking-[1px]`}
                            >
                              {cell.render('Cell')}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Scrollbar>
        </div>
        <div
          className={`shadow-card dark:bg-light-dark -mt-[2px] flex items-center justify-center rounded-bl-lg rounded-br-lg bg-white px-5 py-4 text-sm lg:py-6`}
        >
          <div className="flex items-center gap-5">
            <Button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              title="Previous"
              shape="circle"
              variant="transparent"
              size="small"
              className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
            >
              <LongArrowLeft className="h-auto w-4 rtl:rotate-180" />
            </Button>
            <div>
              Page{' '}
              <strong className="font-semibold">
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </div>
            <Button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              title="Next"
              shape="circle"
              variant="transparent"
              size="small"
              className="text-gray-700 disabled:text-gray-400 dark:text-white disabled:dark:text-gray-400"
            >
              <LongArrowRight className="h-auto w-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamLeaderBoardTable;
