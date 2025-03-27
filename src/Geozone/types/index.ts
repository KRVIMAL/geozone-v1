// Define all types used across the Geozone components

export interface GeoZone {
    _id: string;
    name: string;
    userId: any;
    userEmail: string;
    mobileNumber: string;
    address: {
      zipCode: string;
      country: string;
      state: string;
      area: string;
      city: string;
      district: string;
    };
    finalAddress: string;
    geoCodeData: {
      type: string;
      geometry: {
        type: string;
        coordinates: number[] | number[][];
        radius?: number;
      };
    };
    createdBy: string;
    locationId?: string;
  }
  
  export interface User {
    _id: string;
    fullName: string;
    email: string;
    roleType: string;
  }
  
  export interface FormField {
    value: string;
    error: string;
  }
  
  export interface FormFields {
    [key: string]: FormField;
  }
  
  export interface GeozoneFormData {
    userId: any;
    userEmail: string;
    name: string;
    mobileNumber: string;
    address: {
      zipCode: string;
      country: string;
      state: string;
      area: string;
      city: string;
      district: string;
    };
    finalAddress: string;
    geoCodeData: {
      type: string;
      geometry: {
        type: string;
        coordinates: number[] | number[][];
        radius?: number;
      };
    };
    createdBy: string;
  }
  
  export interface PaginationParams {
    page: number;
    limit: number;
  }
  
  export interface GeozoneFilter extends PaginationParams {
    searchText?: string;
  }