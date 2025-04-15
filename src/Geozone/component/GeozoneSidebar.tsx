import React, { RefObject } from 'react';
import { SearchIcon } from 'lucide-react';
import GeozoneList from './GeozoneList';
import { GeoZone } from '../types';
import GeozoneDrawingTools from './GeozoneDrawingTools';

interface GeozoneSidebarProps {
  collapsed: boolean;
  autocompleteRef: RefObject<HTMLInputElement>;
  activeDrawingTool: string | null;
  handleDrawingToolClick: (tool: string) => void;
  geozoneData: GeoZone[];
  loading: boolean;
  searchText: string;
  setSearchText: (text: string) => void;
  handleEditGeozone: (geozone: GeoZone) => void;
  handleDeleteGeozone: (id: string) => void;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  setLimit: (limit: number) => void;
  total: number;
}

const GeozoneSidebar: React.FC<GeozoneSidebarProps> = ({
  collapsed,
  autocompleteRef,
  activeDrawingTool,
  handleDrawingToolClick,
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
    <div
      className={`${
        collapsed ? "w-0" : "w-80"
      } transition-all duration-300 ease-in-out overflow-hidden bg-white dark:bg-gray-800 shadow-md`}
    >
      <div className={`p-4 ${collapsed ? "hidden" : "block"}`}>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white border-l-4 border-indigo-600 pl-2">
            Create Geozone
          </h2>

          <div className="relative mb-4">
            <input
              ref={autocompleteRef}
              type="text"
              placeholder="Search location..."
              className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white"
            />
            <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

          <GeozoneDrawingTools
            activeDrawingTool={activeDrawingTool}
            handleDrawingToolClick={handleDrawingToolClick}
          />
        </div>

        <GeozoneList
          geozoneData={geozoneData}
          loading={loading}
          searchText={searchText}
          setSearchText={setSearchText}
          handleEditGeozone={handleEditGeozone}
          handleDeleteGeozone={handleDeleteGeozone}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
          total={total}
        />
      </div>
    </div>
  );
};

export default GeozoneSidebar;