// Import types
import { FormFields, GeoZone } from '../types';

// Use the existing geoZoneInsertField implementation from your helper
export const geoZoneInsertField = (data?: any): FormFields => {
  return {
    name: {
      value: data?.name ?? "",
      error: "",
    },
    type: {
      value: data?.geoCodeData?.geometry?.type ?? "",
      error: "",
    },
    user: {
      value: data?.userId._id ?? "",
      error: "",
    },
    userEmail: {
      value: data?.userEmail ?? "",
      error: "",
    },
    mobileNumber: {
      value: data?.mobileNumber ?? "",
      error: "",
    },
    address: {
      value: data?.finalAddress ?? "",
      error: "",
    },
    zipCode: {
      value: data?.address?.zipCode ?? "",
      error: "",
    },
    country: {
      value: data?.address?.country ?? "",
      error: "",
    },
    state: {
      value: data?.address?.state ?? "",
      error: "",
    },
    area: {
      value: data?.address?.area ?? "",
      error: "",
    },
    city: {
      value: data?.address?.city ?? "",
      error: "",
    },
    district: {
      value: data?.address?.district ?? "",
      error: "",
    },
    lat: {
      value: data?.geoCodeData?.geometry?.coordinates?.[0]?.toString() ?? "",
      error: "",
    },
    long: {
      value: data?.geoCodeData?.geometry?.coordinates?.[1]?.toString() ?? "",
      error: "",
    },
    radius: {
      value: data?.geoCodeData?.geometry?.radius?.toString() ?? "",
      error: "",
    },
    description: {
      value: "",
      error: "",
    }
  };
};

// Validate form fields
export const validateFormFields = (formField: FormFields): { isValid: boolean, updatedFields: FormFields } => {
  let isValid = true;
  const updatedFields = { ...formField };

  // Check required fields
  // ["user", "mobileNumber", "zipCode", "address"].forEach((field) => {
  //   if (!formField[field]?.value || formField[field]?.value?.trim() === "") {
  //     updatedFields[field] = {
  //       ...updatedFields[field],
  //       error: `Please enter ${field}.`,
  //     };
  //     isValid = false;
  //   }
  // });
  // Special handling for radius if shape type is Circle
  if (formField.type.value === "Circle" && (!formField.radius?.value || formField.radius.value === "0")) {
    updatedFields.radius = {
      ...updatedFields.radius,
      error: "Please enter radius.",
    };
    isValid = false;
  }

  return { isValid, updatedFields };
};