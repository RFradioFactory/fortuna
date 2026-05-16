export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: Coordinates;
}
