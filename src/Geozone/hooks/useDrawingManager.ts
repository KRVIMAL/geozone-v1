import { useState, useEffect } from 'react';
import { FormFields } from '../types';

interface UseDrawingManagerProps {
  google: any;
  map: google.maps.Map | null;
  drawingManager: google.maps.drawing.DrawingManager | null;
  setFormField: React.Dispatch<React.SetStateAction<FormFields>>;
  setOpenModal: (isOpen: boolean) => void;
}

export const useDrawingManager = ({
  google,
  map,
  drawingManager,
  setFormField,
  setOpenModal
}: UseDrawingManagerProps) => {
  const [selectedShape, setSelectedShape] = useState<any>(null);
  const [shapes, setShapes] = useState<any[]>([]);
  const [activeDrawingTool, setActiveDrawingTool] = useState<string | null>(null);

  // Setup drawing manager event listeners
  useEffect(() => {
    if (!google || !map || !drawingManager) return;

    const handleOverlayComplete = (event: any) => {
      // Switch off drawing mode
      drawingManager.setDrawingMode(null);
      setActiveDrawingTool(null);

      const newShape = event.overlay;
      newShape.type = event.type;

      // Add event listeners to the shape
      google.maps.event.addListener(newShape, "click", () => {
        setSelectedShape(newShape);
      });

      setSelectedShape(newShape);
      setShapes((prevShapes) => [...prevShapes, newShape]);

      // Handle shape creation
      handleShapeCreated(newShape, event.type);
    };

    // Add listener for overlay complete
    google.maps.event.addListener(
      drawingManager,
      "overlaycomplete",
      handleOverlayComplete
    );

    return () => {
      // Remove listener on cleanup
      if (google.maps.event) {
        google.maps.event.clearListeners(drawingManager, "overlaycomplete");
      }
    };
  }, [google, map, drawingManager, shapes]);

  // Handle shape creation
  const handleShapeCreated = (shape: any, type: string) => {
    if (!google) return;
    
    let coordinates: any[] | number[][] = [];
    let radius = 0;
    let shapeType = "";
  
    if (type === google.maps.drawing.OverlayType.MARKER) {
      const position = shape.getPosition();
      if (!position) return;
      
      coordinates = [position.lat(), position.lng()];
      shapeType = "Point";
      radius = 0;
    } else if (type === google.maps.drawing.OverlayType.CIRCLE) {
      const center = shape.getCenter();
      if (!center) return;
  
      coordinates = [center.lat(), center.lng()];
      radius = shape.getRadius();
      shapeType = "Circle";
    } else if (type === google.maps.drawing.OverlayType.POLYGON) {
      const path = shape.getPath();
      coordinates = path.getArray().map((latLng: any) => [latLng.lat(), latLng.lng()]);
      shapeType = "Polygon";
      radius = 0;
    } else if (type === google.maps.drawing.OverlayType.POLYLINE) {
      const path = shape.getPath();
      coordinates = path.getArray().map((latLng: any) => [latLng.lat(), latLng.lng()]);
      shapeType = "Polyline";
      radius = 0;
    } else if (type === google.maps.drawing.OverlayType.RECTANGLE) {
      const bounds = shape?.getBounds();
      if (!bounds) return;
  
      const ne: any = bounds.getNorthEast();
      const sw: any = bounds.getSouthWest();
      coordinates = [
        [ne.lat(), ne.lng()],
        [sw.lat(), sw.lng()],
      ];
      shapeType = "Rectangle";
      radius = 0;
    }
  
    if (!Array.isArray(coordinates) || coordinates.length === 0) return;
    
    // For Point and Circle, coordinates is [lat, lng]
    const lat = Array.isArray(coordinates[0]) ? coordinates[0][0] : coordinates[0];
    const lng :any= Array.isArray(coordinates[1]) ? coordinates[0][1] : coordinates[1];
  
    // Update form with shape data
    setFormField((prevState) => ({
      ...prevState,
      type: { value: shapeType, error: "" },
      lat: { value: String(lat), error: "" },
      long: { value: String(lng), error: "" },
      radius: { value: radius.toString(), error: "" },
    }));
  
    // Reverse geocode to get address
    if (google.maps.Geocoder && lat !== undefined && lng !== undefined) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode(
        { location: { lat, lng } },
        (results: any, status: any) => {
          if (status === "OK" && results && results[0]) {
            const addressComponents = results[0].address_components;
            let zipCode = "";
            let country = "";
            let state = "";
            let city = "";
            let district = "";
            let area = "";
    
            for (const component of addressComponents) {
              const types = component.types;
              if (types.includes("postal_code")) {
                zipCode = component.long_name;
              } else if (types.includes("country")) {
                country = component.long_name;
              } else if (types.includes("administrative_area_level_1")) {
                state = component.long_name;
              } else if (types.includes("locality")) {
                city = component.long_name;
              } else if (types.includes("sublocality_level_1")) {
                district = component.long_name;
              } else if (types.includes("sublocality_level_2")) {
                area = component.long_name;
              }
            }
    
            const address = results[0].formatted_address;
            
            setFormField((prevState) => ({
              ...prevState,
              zipCode: { value: zipCode, error: "" },
              country: { value: country, error: "" },
              state: { value: state, error: "" },
              city: { value: city, error: "" },
              district: { value: district, error: "" },
              area: { value: area, error: "" },
              address: { value: address, error: "" },
            }));
          }
        }
      );
    }
  
    setOpenModal(true);
  };

  // Handle drawing tool selection
  const handleDrawingToolClick = (tool: string) => {
    if (!drawingManager || !map || !google) return;

    if (activeDrawingTool === tool) {
      // Turn off drawing mode
      drawingManager.setDrawingMode(null);
      setActiveDrawingTool(null);
    } else {
      // Set drawing mode
      let drawingMode = null;

      switch (tool) {
        case "marker":
          drawingMode = google.maps.drawing.OverlayType.MARKER;
          break;
        case "circle":
          drawingMode = google.maps.drawing.OverlayType.CIRCLE;
          break;
        case "polygon":
          drawingMode = google.maps.drawing.OverlayType.POLYGON;
          break;
        case "polyline":
          drawingMode = google.maps.drawing.OverlayType.POLYLINE;
          break;
        case "rectangle":
          drawingMode = google.maps.drawing.OverlayType.RECTANGLE;
          break;
      }

      drawingManager.setDrawingMode(drawingMode);
      setActiveDrawingTool(tool);
    }
  };

  // Clear shapes from map
  const clearShapes = () => {
    shapes.forEach((shape: any) => {
      shape?.setMap(null);
    });
    setShapes([]);
    setSelectedShape(null);
  };

  return {
    selectedShape,
    setSelectedShape,
    shapes,
    setShapes,
    activeDrawingTool,
    setActiveDrawingTool,
    handleDrawingToolClick,
    handleShapeCreated,
    clearShapes
  };
};