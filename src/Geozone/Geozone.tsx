import { useEffect, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

import { useGoogleMaps } from "./hooks/useGoogleMaps";
import { useDrawingManager } from "./hooks/useDrawingManager";
import { useGeozoneData } from "./hooks/useGeozoneData";
import { useEditableShapes } from "./hooks/useEditableShapes";


import { setupAutocomplete } from "./utils/mapHelpers";
import GeozoneSidebar from "./component/GeozoneSidebar";
import GeozoneMap from "./component/GeozoneMap";
import GeozoneControls from "./component/GeozoneControls";
import CreateGeoZoneModal from "./component/CreateGeoZone.Modal";

const Geozone = () => {
  // State variables
  const [collapsed, setCollapsed] = useState<boolean>(false);
  
  // Refs
  const mapRef :any= useRef<HTMLDivElement>(null);
  const autocompleteRef:any = useRef<HTMLInputElement>(null);
  const autocompleteInstance = useRef<any>(null);

  // Initialize Google Maps
  const { google, map, drawingManager, isLoaded } = useGoogleMaps(mapRef);
  
  // Initialize Geozone data handling
  const {
    geozoneData,
    users,
    loading,
    page,
    setPage,
    limit,
    setLimit,
    total,
    searchText,
    setSearchText,
    selectedRowData,
    edit,
    isOpen,
    setOpenModal,
    formField,
    setFormField,
    addGeozoneHandler,
    handleEditGeozone,
    handleDeleteGeozone,
    handleCloseDialog,
    handleUserChange,
    updateGeozoneShape
  } = useGeozoneData({ google, map });

  // Initialize Drawing Manager functionality
  const {
    selectedShape,
    setSelectedShape,
    activeDrawingTool,
    handleDrawingToolClick
  } = useDrawingManager({
    google,
    map,
    drawingManager,
    setFormField,
    setOpenModal
  });
  
  // Initialize editable shapes functionality
  const {
    isEditMode,
    toggleEditMode,
    error: editShapesError
  } = useEditableShapes({
    google,
    map,
    geozoneData,
    updateGeozone: updateGeozoneShape
  });

  // Setup autocomplete for location search
  useEffect(() => {
    if (google && map && autocompleteRef.current) {
      autocompleteInstance.current = setupAutocomplete(
        google,
        map,
        autocompleteRef,
        setFormField,
        setSelectedShape,
        setOpenModal
      );
    }
  }, [google, map]);

  // Toggle sidebar
  const handleToggle = () => {
    setCollapsed(!collapsed);
  };

  // Handle form submission
  const handleAddGeozone = () => {
    addGeozoneHandler(selectedShape);
  };

  // Close modal wrapper
  const handleCloseModal = () => {
    handleCloseDialog(selectedShape);
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <GeozoneSidebar
        collapsed={collapsed}
        autocompleteRef={autocompleteRef}
        activeDrawingTool={activeDrawingTool}
        handleDrawingToolClick={handleDrawingToolClick}
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

      {/* Toggle button */}
      <button
        onClick={handleToggle}
        className="absolute top-4 left-80 z-10 bg-white dark:bg-gray-800 shadow-md rounded-full p-2 transform -translate-x-1/2"
      >
        {collapsed ? (
          <ChevronRightIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        ) : (
          <ChevronLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
      </button>

      {/* Map */}
      <GeozoneMap mapRef={mapRef} />

      {/* Map Controls */}
      <GeozoneControls 
        isEditMode={isEditMode} 
        toggleEditMode={toggleEditMode}
        error={editShapesError}
        geozoneData={geozoneData}
      />

      {/* Modal */}
      <CreateGeoZoneModal
        isOpenModal={isOpen}
        handleUpdateDialogClose={handleCloseModal}
        setFormField={setFormField}
        formField={formField}
        addGeozoneHandler={handleAddGeozone}
        users={users}
        edit={edit}
        handleUserChange={handleUserChange}
      />

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      )}
    </div>
  );
};

export default Geozone;