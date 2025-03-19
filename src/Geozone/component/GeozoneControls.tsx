import React from 'react';
import { EditIcon, SaveIcon } from 'lucide-react';

interface GeozoneControlsProps {
  isEditMode: boolean;
  toggleEditMode: () => void;
  error: string | null;
}

const GeozoneControls: React.FC<GeozoneControlsProps> = ({
  isEditMode,
  toggleEditMode,
  error
}) => {
  return (
    <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-md shadow-md p-2">
      {error && (
        <div className="text-red-500 text-sm mb-2 p-2 bg-red-50 dark:bg-red-900 dark:bg-opacity-20 rounded">
          {error}
        </div>
      )}
      
      <button
        onClick={toggleEditMode}
        className={`flex items-center space-x-1 px-3 py-2 rounded-md ${
          isEditMode
            ? "bg-green-600 text-white hover:bg-green-700"
            : "bg-indigo-600 text-white hover:bg-indigo-700"
        }`}
        title={isEditMode ? "Save Changes" : "Edit Geozones"}
      >
        {isEditMode ? (
          <>
            <SaveIcon className="h-4 w-4" />
            <span>Save Changes</span>
          </>
        ) : (
          <>
            <EditIcon className="h-4 w-4" />
            <span>Edit Geozones</span>
          </>
        )}
      </button>
    </div>
  );
};

export default GeozoneControls;