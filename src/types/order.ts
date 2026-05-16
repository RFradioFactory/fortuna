export interface Order {
  id: string;
  cityFrom: string;
  cityTo: string;
  cargoType: string;
  cargoWeight: string;
  dateMode: 'asap' | 'pick';
  selectedDate: string | null;
  status: string;
  createdAt: string;
}

export type SortOption = 'createdAt' | 'shipmentDate';

export interface ApplicationData {
  cityFrom: string;
  cityTo: string;
  cargoType: string;
  cargoWeight: string;
  dateMode: string;
  selectedDate: string | null;
  phone: string;
}
