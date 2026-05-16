import { useState, useEffect, useRef } from 'react';
import { City, AutocompleteProps } from '../../types';

const Autocomplete: React.FC<AutocompleteProps> = ({
  value,
  onChange,
  onSelect,
  placeholder = 'Начните вводить город...',
  label,
  cities
}) => {
  const [suggestions, setSuggestions] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isValid, setIsValid] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const suppressNextOpenRef = useRef(false);

  // Normalize helper
  const normalize = (s: string) => (s || '').toString().trim().toLowerCase().replace(/ё/g,'е');

  // Find cities based on query
  const findCities = (query: string) => {
    const q = normalize(query);
    if (q.length < 3) return [];
    
    const starts = [];
    const contains = [];
    
    for (const city of cities) {
      const n = normalize(city.name);
      if (n.startsWith(q)) starts.push(city);
      else if (n.includes(q)) contains.push(city);
      if (starts.length >= 12 && contains.length >= 12) break;
    }
    
    return [...starts, ...contains].slice(0, 12);
  };

  useEffect(() => {
    if (value.length >= 3) {
      const items = findCities(value);
      setSuggestions(items);
      if (suppressNextOpenRef.current) {
        suppressNextOpenRef.current = false;
        setIsOpen(false);
      } else {
        setIsOpen(items.length > 0);
      }
      setActiveIndex(0);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [value, cities]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    suppressNextOpenRef.current = false;
    onChange(newValue);
    setIsValid(false); // Mark as not picked until user selects from list
  };

  const handleSelectCity = (city: City) => {
    suppressNextOpenRef.current = true;
    onChange(city.name);
    onSelect(city);
    setSuggestions([]);
    setIsOpen(false);
    setIsValid(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, Math.min(suggestions.length, 12) - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = suggestions[activeIndex];
      if (selected) {
        handleSelectCity(selected);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleFocus = () => {
    if (value.length >= 3) {
      const items = findCities(value);
      setSuggestions(items);
      setIsOpen(items.length > 0);
      setActiveIndex(0);
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () => document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  return (
    <div className={`field ${!isValid ? 'invalid' : ''}`} ref={containerRef}>
      {label && <div className="label">{label}</div>}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        placeholder={placeholder}
        autoComplete="off"
      />
      <div className={`ac ${isOpen ? 'show' : ''}`}>
        {suggestions.slice(0, 12).map((city, index) => (
          <div
            key={city.id}
            className={`acItem ${index === activeIndex ? 'active' : ''}`}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSelectCity(city);
            }}
          >
            <span className="acCity">{city.name}</span>
            <span className="acRegion">{city.region || ''}</span>
          </div>
        ))}
      </div>
      <div className="errorText">Введите город (минимум 3 буквы и выберите из списка).</div>
    </div>
  );
};

export default Autocomplete;
