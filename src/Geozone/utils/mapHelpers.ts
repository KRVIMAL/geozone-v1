import { FormFields } from '../types';
import { getAddressDetailsByPincode } from '../services/geozone.service';

// Initialize autocomplete for location search
export const setupAutocomplete = (
  google: any,
  map: google.maps.Map | null,
  autocompleteRef: React.RefObject<HTMLInputElement>,
  setFormField: React.Dispatch<React.SetStateAction<FormFields>>,
  setSelectedShape: (shape: any) => void,
  setOpenModal: (isOpen: boolean) => void
) => {
  if (!google || !map || !autocompleteRef.current) return null;

  const autocomplete = new google.maps.places.Autocomplete(
    autocompleteRef.current,
    {
      types: ["geocode"],
      componentRestrictions: { country: "in" },
    }
  );

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (place?.geometry && place?.geometry?.location) {
      map.setCenter(place.geometry.location);
      map.setZoom(15);

      // Create a marker for the selected place
      const marker = new google.maps.Marker({
        position: place.geometry.location,
        map: map,
        title: place.name,
      });

      // Handle place selection
      handlePlaceSelection(place, marker, setFormField, setSelectedShape, setOpenModal);
    }
  });

  return autocomplete;
};

// Handle place selection from autocomplete
export const handlePlaceSelection = (
  place: google.maps.places.PlaceResult,
  marker: google.maps.Marker,
  setFormField: React.Dispatch<React.SetStateAction<FormFields>>,
  setSelectedShape: (shape: any) => void,
  setOpenModal: (isOpen: boolean) => void
) => {
  const lat = place.geometry?.location?.lat();
  const lng = place.geometry?.location?.lng();

  if (lat && lng) {
    setFormField((prev) => ({
      ...prev,
      type: { value: "Point", error: "" },
      lat: { value: lat.toString(), error: "" },
      long: { value: lng.toString(), error: "" },
      radius: { value: "0", error: "" },
      address: { value: place.formatted_address || "", error: "" },
      name: { value: place.name || "", error: "" },
    }));
    setSelectedShape(marker);
    setOpenModal(true);
  }
};

// Fetch address details by zip code
export const fetchZipCodeDetails = async (
  zipCode: string,
  formField: FormFields,
  setFormField: React.Dispatch<React.SetStateAction<FormFields>>
) => {
  try {
    const data = await getAddressDetailsByPincode(zipCode);
    if (data && data.length > 0) {
      const item = data[0];
      setFormField({
        ...formField,
        country: { ...formField.country, value: item.Country, error: "" },
        state: { ...formField.state, value: item.State, error: "" },
        area: { ...formField.area, value: item.Name, error: "" },
        district: { ...formField.district, value: item.District, error: "" },
        city: { ...formField.city, value: item.Block, error: "" },
        address: {
          ...formField.address,
          value: `${item.Country} - ${item.State} - ${item.Name} - ${item.District} - ${item.Block}`,
          error: "",
        },
      });
    }
  } catch (error) {
    console.error("Error fetching zip code details:", error);
  }
};