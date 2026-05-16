import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import Autocomplete from "../autocomplete/Autocomplete";
import ErrorMessage from "../error/ErrorMessage";
import { toggleTheme } from "../../utils/theme";
import { City, RouteData } from "../../types";

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
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const loadCities = useCallback(async () => {
    try {
      // TODO: Backend request for cities
      // const response = await apiService.getCities();
      // setCities(response.cities);

      // Current implementation: load from local JSON file
      const response = await fetch('./cities.json');
      const data = await response.json();
      setCities(data.items || []);
    } catch (err) {
      console.error('Failed to load cities:', err);
      setError('Не удалось загрузить список городов');
    }
  }, []);

  useEffect(() => {
    loadCities();

    // Load saved data from localStorage
    const savedFrom = localStorage.getItem('cityFrom');
    const savedTo = localStorage.getItem('cityTo');
    if (savedFrom) setFromCityText(savedFrom);
    if (savedTo) setToCityText(savedTo);
  }, [loadCities]);

  const handleFromCitySelect = (city: City) => {
    setRouteData(prev => ({ ...prev, from: city }));
    setFromPicked(true);
    localStorage.setItem('cityFrom', city.id);
  };

  const handleToCitySelect = (city: City) => {
    setRouteData(prev => ({ ...prev, to: city }));
    setToPicked(true);
    localStorage.setItem('cityTo', city.id);
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      navigate('/cargo');
    }
  };

  const handleBackButton = () => {
    navigate('/main');
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
          {error && (
            <ErrorMessage
              message={error}
              onRetry={() => {
                setError(null);
                loadCities();
              }}
            />
          )}
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
