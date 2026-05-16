export interface City {
  id: string;
  name: string;
  region?: string;
}

export interface CargoType {
  id: string;
  name: string;
  description?: string;
}

export interface CargoData {
  type: string;
  weight: string;
}

export interface RouteData {
  from: City | null;
  to: City | null;
}

export interface DateData {
  mode: 'asap' | 'pick';
  value: Date | null;
}

export interface DocumentItem {
  name: string;
  filename: string;
  description?: string;
}

export interface DocumentSection {
  title: string;
  items: DocumentItem[];
}

export interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  initialDate?: Date;
}

export interface AutocompleteProps {
  items: City[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (city: City) => void;
  placeholder?: string;
  label?: string;
}

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export interface SDKProviderErrorProps {
  error: unknown;
}

export type TelegramContactResult = {
  contact?: {
    phoneNumber?: string;
  };
};
