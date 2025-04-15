import { useState, useEffect } from "react";
import {
  fetchGeozoneHandler,
  createGeozone,
  updateGeozone,
  deleteGeozone,
  searchUsers,
} from "../services/geozone.service";
import { GeoZone, User, FormFields } from "../types";
import { geoZoneInsertField, validateFormFields } from "../utils/formHelpers";
import toast from "react-hot-toast";

interface UseGeozoneDataProps {
  google: any;
  map: google.maps.Map | null;
}

export const useGeozoneData = ({ google, map }: UseGeozoneDataProps) => {
  const [geozoneData, setGeozoneData] = useState<GeoZone[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>("");
  const [selectedRowData, setSelectedRowData] = useState<GeoZone | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [isOpen, setOpenModal] = useState<boolean>(false);
  const [formField, setFormField] = useState<FormFields>(geoZoneInsertField());
  const [shapes, setShapes] = useState<any[]>([]);

  // Fetch users and geozones on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchGeozone();
  }, [page, limit, searchText]);

  // Display geozones on map when data changes
  useEffect(() => {
    if (map && geozoneData?.length > 0 && google) {
      displayGeozonesOnMap();
    }
  }, [map, geozoneData, google]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await searchUsers();
      if (res && res.data) {
        setUsers(res.data);
      }
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setLoading(false);
    }
  };

  // Fetch geozones
  const fetchGeozone = async () => {
    try {
      setLoading(true);
      const res = await fetchGeozoneHandler({
        input: {
          page,
          limit,
          ...(searchText && { searchText }),
        },
      });
      setGeozoneData(res?.data?.data || []);
      setTotal(res?.data?.total || 0);
      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching geozones:", error);
      setGeozoneData([]);
      setLoading(false);
    }
  };

  // Display geozones on map
  const displayGeozonesOnMap = () => {
    if (!map || !google) return;

    // Clear existing shapes
    shapes?.forEach((shape: any) => {
      shape?.setMap(null);
    });

    // Add geozones to map
    const newShapes = geozoneData
      ?.map((geozone: GeoZone) => {
        const { geoCodeData } = geozone;
        const { geometry } = geoCodeData;
        const { type, coordinates, radius } = geometry;
        let shape: any;

        switch (type) {
          case "Circle":
            shape = new google.maps.Circle({
              center: { lat: coordinates[0], lng: coordinates[1] },
              radius: radius || 100,
              map,
              fillColor: "#4285F4",
              fillOpacity: 0.3,
              strokeWeight: 2,
              strokeColor: "#4285F4",
            });
            break;
          case "Polygon":
            shape = new google.maps.Polygon({
              paths: coordinates?.map((coord: any) => ({
                lat: coord[0],
                lng: coord[1],
              })),
              map,
              fillColor: "#4285F4",
              fillOpacity: 0.3,
              strokeWeight: 2,
              strokeColor: "#4285F4",
            });
            break;
          case "Polyline":
            shape = new google.maps.Polyline({
              path: coordinates?.map((coord: any) => ({
                lat: coord[0],
                lng: coord[1],
              })),
              map,
              strokeColor: "#4285F4",
              strokeWeight: 2,
            });
            break;
          case "Point":
            // Handle point type (marker)
            if (google.maps.Marker) {
              shape = new google.maps.Marker({
                position: { lat: coordinates[0], lng: coordinates[1] },
                map,
                title: geozone?.name,
              });
            }
            break;
        }

        if (shape) {
          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div>
                <h3>${geozone?.name}</h3>
                <p>${geozone?.finalAddress}</p>
                ${type === "Circle" ? `<p>Radius: ${radius} meters</p>` : ""}
              </div>
            `,
          });

          shape?.addListener("click", (e: any) => {
            infoWindow?.setPosition(
              type === "Point" ? shape?.getPosition() : e?.latLng
            );
            infoWindow?.open(map);
          });

          shape.geozoneData = geozone;
        }

        return shape;
      })
      ?.filter(Boolean);

    setShapes(newShapes);
  };

  // Validate form fields
  const validateFields = () => {
    const { isValid, updatedFields } = validateFormFields(formField);
    setFormField(updatedFields);
    return isValid;
  };

  // Add or update geozone
  const addGeozoneHandler = async (selectedShape: any) => {
    if (!validateFields()) {
      return;
    }

    try {
      setLoading(true);

      const shapeType = formField.type.value;
      let coordinates: number[] | number[][] = [];
      let radius: number | undefined;

      if (selectedShape) {
        if (shapeType === "Point") {
          coordinates = [
            Number.parseFloat(formField.lat.value),
            Number.parseFloat(formField.long.value),
          ];
        } else if (shapeType === "Circle") {
          coordinates = [
            Number.parseFloat(formField.lat.value),
            Number.parseFloat(formField.long.value),
          ];
          radius = Number.parseFloat(formField.radius.value);
        } else if (shapeType === "Polygon" || shapeType === "Polyline") {
          const path = selectedShape.getPath();
          coordinates = path
            .getArray()
            .map((latLng: any) => [latLng.lat(), latLng.lng()]);
        } else if (shapeType === "Rectangle") {
          const bounds = selectedShape.getBounds();
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          coordinates = [
            [ne.lat(), ne.lng()],
            [sw.lat(), sw.lng()],
          ];
        }
      }

      const payload = {
        userId: formField.user?.value,
        userEmail: formField.userEmail?.value,
        name: formField.name?.value,
        mobileNumber: formField.mobileNumber?.value,
        address: {
          zipCode: formField.zipCode?.value,
          country: formField.country?.value,
          state: formField.state?.value,
          area: formField.area?.value,
          city: formField.city?.value,
          district: formField.district?.value,
        },
        finalAddress: formField.address?.value,
        geoCodeData: {
          type: "Feature",
          geometry: {
            type: shapeType,
            coordinates: coordinates,
            ...(radius !== undefined && { radius }),
          },
        },
        isPublic: formField.isPublic?.value === "true",
        isPrivate: formField.isPrivate?.value === "true",
        createdBy: "admin",
      };

      if (edit && selectedRowData) {
        const res = await updateGeozone({
          input: {
            _id: selectedRowData._id,
            ...payload,
          },
        });
        toast.success(res.message);
        setEdit(false);
      } else {
        const res = await createGeozone({
          input: payload,
        });
        toast.success(res.message);
      }

      handleCloseDialog();

      // Clear selected shape
      if (selectedShape) {
        selectedShape.setMap(null);
      }

      // Reset form
      setFormField(geoZoneInsertField());

      // Refresh geozones
      await fetchGeozone();

      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      toast.success(error.message);
    }
  };

  // Handle edit geozone
  const handleEditGeozone = (geozone: GeoZone) => {
    setSelectedRowData(geozone);

    // Find the user by userId to populate the user field
    const user = users.find((u) => u._id === geozone?.userId?._id);

    setFormField(
      geoZoneInsertField({
        ...geozone,
        user: user?.fullName || "",
        userEmail: geozone.userEmail || user?.email || "",
      })
    );

    setEdit(true);
    setOpenModal(true);

    // Center map on the geozone
    if (map) {
      const { coordinates }: any = geozone.geoCodeData.geometry;
      const lat = Array.isArray(coordinates[0])
        ? coordinates[0][0]
        : coordinates[0];
      const lng = Array.isArray(coordinates[1])
        ? coordinates[0][1]
        : coordinates[1];

      map.setCenter({ lat, lng });
      map.setZoom(15);
    }
  };

  // Handle delete geozone
  const handleDeleteGeozone = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this geozone?")) {
      try {
        setLoading(true);
        const res = await deleteGeozone(id);
        toast.success(res.message);
        // Remove the shape from the map if it exists
        if (map) {
          shapes.forEach((shape) => {
            if (
              shape?.geozoneData?._id === id &&
              typeof shape.setMap === "function"
            ) {
              shape.setMap(null);
            }
          });
          // Remove from shapes array
          setShapes(shapes.filter((shape) => shape?.geozoneData?._id !== id));
        }

        await fetchGeozone();
        setLoading(false);
      } catch (error: any) {
        toast.success(error.message);
        setLoading(false);
      }
    }
  };

  const handleCloseDialog = (drawnShape?: any) => {
    setOpenModal(false);
    if (drawnShape && typeof drawnShape.setMap === "function") {
      if (!edit || !shapes.includes(drawnShape)) {
        drawnShape.setMap(null);
      }
    }
    setFormField(geoZoneInsertField());
    if (edit) {
      setEdit(false);
    }
    setSelectedRowData(null);
  };

  // Handle user selection for the form
  const handleUserChange = (userId: string) => {
    const user = users.find((u) => u._id === userId);
    if (user) {
      setFormField({
        ...formField,
        user: { ...formField.user, value: userId, error: "" },
        userEmail: { ...formField.userEmail, value: user.email, error: "" },
      });
    }
  };

  // Directly update a geozone
  const updateGeozoneShape = async (updatedGeozone: GeoZone) => {
    try {
      setLoading(true);
      await updateGeozone({
        input: updatedGeozone,
      });
      await fetchGeozone(); // Refresh data
      setLoading(false);
    } catch (error) {
      toast.success(error.message);
      setLoading(false);
    }
  };

  return {
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
    setSelectedRowData,
    edit,
    setEdit,
    isOpen,
    setOpenModal,
    formField,
    setFormField,
    shapes,
    setShapes,
    fetchGeozone,
    fetchUsers,
    displayGeozonesOnMap,
    validateFields,
    addGeozoneHandler,
    handleEditGeozone,
    handleDeleteGeozone,
    handleCloseDialog,
    handleUserChange,
    updateGeozoneShape,
  };
};
