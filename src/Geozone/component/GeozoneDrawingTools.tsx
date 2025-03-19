import React from 'react';
import { 
  PinIcon, 
  CircleIcon, 
  SquareIcon, 
  LineChartIcon as LineIcon
} from 'lucide-react';

interface GeozoneDrawingToolsProps {
  activeDrawingTool: string | null;
  handleDrawingToolClick: (tool: string) => void;
}

const GeozoneDrawingTools: React.FC<GeozoneDrawingToolsProps> = ({
  activeDrawingTool,
  handleDrawingToolClick
}) => {
  return (
    <div className="flex space-x-2 mb-4">
      <button
        onClick={() => handleDrawingToolClick("marker")}
        className={`p-2 rounded-md ${
          activeDrawingTool === "marker"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        }`}
        title="Add Point"
      >
        <PinIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => handleDrawingToolClick("circle")}
        className={`p-2 rounded-md ${
          activeDrawingTool === "circle"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        }`}
        title="Add Circle"
      >
        <CircleIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => handleDrawingToolClick("polygon")}
        className={`p-2 rounded-md ${
          activeDrawingTool === "polygon"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        }`}
        title="Add Polygon"
      >
        <SquareIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => handleDrawingToolClick("polyline")}
        className={`p-2 rounded-md ${
          activeDrawingTool === "polyline"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        }`}
        title="Add Polyline"
      >
        <LineIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => handleDrawingToolClick("rectangle")}
        className={`p-2 rounded-md ${
          activeDrawingTool === "rectangle"
            ? "bg-indigo-600 text-white"
            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
        }`}
        title="Add Rectangle"
      >
        <SquareIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default GeozoneDrawingTools;