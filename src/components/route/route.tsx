import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Autocomplete from "../autocomplete/Autocomplete";

interface City {
  id: string;
  name: string;
  region?: string;
}

interface RouteData {
  from: City | null;
  to: City | null;
}

const RouteComponent = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [routeData, setRouteData] = useState<RouteData>({
    from: null,
    to: null
  });
  const [fromCityText, setFromCityText] = useState('');
  const [toCityText, setToCityText] = useState('');
  const [fromPicked, setFromPicked] = useState(false);
  const [toPicked, setToPicked] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Load cities from JSON
    fetch('./cities.json')
      .then(response => response.json())
      .then(data => setCities(data.items || []))
      .catch(error => console.error('Error loading cities:', error));

    // Load saved data from localStorage
    const savedFrom = localStorage.getItem('cityFrom');
    const savedTo = localStorage.getItem('cityTo');
    if (savedFrom) setFromCityText(savedFrom);
    if (savedTo) setToCityText(savedTo);
  }, []);

  const handleFromCitySelect = (city: City) => {
    setRouteData(prev => ({ ...prev, from: city }));
    setFromPicked(true);
    localStorage.setItem('cityFrom', city.name);
  };

  const handleToCitySelect = (city: City) => {
    setRouteData(prev => ({ ...prev, to: city }));
    setToPicked(true);
    localStorage.setItem('cityTo', city.name);
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      navigate('/cargo');
    }
  };

  const handleBackButton = () => {
    navigate('/main');
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') || 'auto';
    const next = current === 'auto' ? 'light' : (current === 'light' ? 'dark' : 'auto');
    
    if (next === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', next);
    }
    
    localStorage.setItem('theme_mode', next);
  };

  const isFormValid = () => {
    return routeData.from && routeData.to && fromPicked && toPicked && routeData.from.id !== routeData.to.id;
  };

  const isButtonDisabled = !isFormValid();

  return (
    <div className="app-container">
      <div className="screen">
        <div className="tgbar">
          <div className="backBtn" onClick={handleBackButton} title="Назад">‹</div>
          <div className="tgtitle">Заявка – шаг 1 из 3</div>
          <div className="tgright">
            <div className="chipBtn" onClick={toggleTheme}>Тема</div>
          </div>
        </div>

        <div className="body">
          <div className="card">
            <div className="sectionTitle">Маршрут перевозки</div>
            <p>Укажите города отправления и назначения.</p>

            <Autocomplete
              value={fromCityText}
              onChange={setFromCityText}
              onSelect={handleFromCitySelect}
              label="Откуда"
              placeholder="Москва"
              cities={cities}
            />

            <Autocomplete
              value={toCityText}
              onChange={setToCityText}
              onSelect={handleToCitySelect}
              label="Куда"
              placeholder="Санкт-Петербург"
              cities={cities}
            />

            <div style={{marginTop: '14px'}} className="info">
              <span className="badge">Подсказка</span>
              <div>В MVP достаточно указать только города – адреса можно уточнить позже с менеджером.</div>
            </div>
          </div>
        </div>

        <div className="mainButtonWrap">
          <div className={`mainButton ${isButtonDisabled ? 'disabled' : ''}`} onClick={handleSubmit}>
            Далее
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteComponent;
