import React from 'react';
import { 
  MapIcon, 
  PencilIcon, 
  TrashIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  SearchIcon 
} from 'lucide-react';
import { GeoZone } from '../types';

interface GeozoneListProps {
  geozoneData: GeoZone[];
  loading: boolean;
  searchText: string;
  setSearchText: (text: string) => void;
  handleEditGeozone: (geozone: GeoZone) => void;
  handleDeleteGeozone: (id: string) => void;
  page: number;
  setPage: (page: any) => void;
  limit: number;
  setLimit: (limit: number) => void;
  total: number;
}

const GeozoneList: React.FC<GeozoneListProps> = ({
  geozoneData,
  loading,
  searchText,
  setSearchText,
  handleEditGeozone,
  handleDeleteGeozone,
  page,
  setPage,
  limit,
  setLimit,
  total
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white border-l-4 border-indigo-600 pl-2">
        Geozone List
      </h2>

      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Search geozone..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
        />
        <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      </div>

      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <ul className="space-y-2">
            {geozoneData.map((item) => (
              <li
                key={item._id}
                className="p-3 bg-white dark:bg-gray-700 rounded-md shadow-sm border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                      <MapIcon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {item.finalAddress}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditGeozone(item)}
                      className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteGeozone(item._id)}
                      className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex justify-between items-center mt-4">
          {/* Limit Selection */}
          <div className="flex items-center">
            <label
              htmlFor="limit"
              className="mr-2 text-sm text-gray-700 dark:text-gray-300"
            >
              Limit:
            </label>
            <select
              id="limit"
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
          </div>

          {/* Page Navigation */}
          <div className="flex items-center space-x-1">
            {/* First Page */}
            <button
              disabled={page === 1}
              onClick={() => setPage(1)}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50"
            >
              First
            </button>

            {/* Previous Page */}
            <button
              disabled={page === 1}
              onClick={() => setPage((prev:any) => Math.max(prev - 1, 1))}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>

            {/* Numbered Page Buttons */}
            {Array.from(
              { length: Math.ceil(total / limit) },
              (_, index) => index + 1
            ).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md 
                  ${
                    page === pageNum
                      ? "bg-indigo-600 text-white"
                      : "bg-white dark:bg-gray-700 dark:text-white"
                  }
                `}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Page */}
            <button
              disabled={page === Math.ceil(total / limit)}
              onClick={() => setPage((prev:any) => prev + 1)}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>

            {/* Last Page */}
            <button
              disabled={page === Math.ceil(total / limit)}
              onClick={() => setPage(Math.ceil(total / limit))}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white disabled:opacity-50"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeozoneList;