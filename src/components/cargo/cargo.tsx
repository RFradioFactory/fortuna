import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import ErrorMessage from "../error/ErrorMessage";
import { toggleTheme } from "../../utils/theme";
import { CargoType, CargoData } from "../../types";

const CargoComponent = () => {
  const [cargoTypes, setCargoTypes] = useState<CargoType[]>([]);
  const [cargoData, setCargoData] = useState<CargoData>({
    type: '',
    weight: ''
  });
  const [isWeightValid, setIsWeightValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const loadCargoTypes = useCallback(async () => {
    try {
      // TODO: Backend request for cargo types
      // const response = await apiService.getCargoTypes();

      // Current implementation: load from local JSON file
      const response = await fetch('./cargo-types.json');
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        setCargoTypes(data.items);
      }
    } catch (err) {
      console.error('Failed to load cargo types:', err);
      setError('Не удалось загрузить типы груза');
    }
  }, []);

  useEffect(() => {
    loadCargoTypes();

    // Load saved data from localStorage
    const savedType = localStorage.getItem('cargoType');
    const savedWeight = localStorage.getItem('cargoWeight');
    if (savedType) {
      setCargoData(prev => ({ ...prev, type: savedType }));
    }
    if (savedWeight) {
      setCargoData(prev => ({ ...prev, weight: savedWeight }));
      setIsWeightValid(savedWeight.trim().length > 0);
    }
  }, [loadCargoTypes]);

  const handleCargoTypeSelect = (type: string) => {
    setCargoData(prev => ({ ...prev, type }));
    localStorage.setItem('cargoType', type);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const weight = e.target.value;
    setCargoData(prev => ({ ...prev, weight }));
    setIsWeightValid(weight.trim().length > 0);
    localStorage.setItem('cargoWeight', weight);
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      navigate('/date');
    }
  };

  const handleBackButton = () => {
    navigate('/route');
  };


  const isFormValid = () => {
    return cargoData.type && isWeightValid;
  };

  const isButtonDisabled = !isFormValid();

  return (
    <div className="app-container">
      <div className="screen">
        <div className="tgbar">
          <div className="backBtn" onClick={handleBackButton} title="Назад">‹</div>
          <div className="tgtitle">Заявка – шаг 2 из 3</div>
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
                loadCargoTypes();
              }}
            />
          )}
          <div className="card">
            <div className="sectionTitle">Параметры груза</div>
            <p>Минимум данных – для быстрой отправки.</p>

            <div className="sectionTitle" style={{marginTop: '6px'}}>Тип груза</div>
            <div className="radio" id="cargoType">
              {cargoTypes.map(cargo => (
                <button
                  key={cargo.id}
                  type="button"
                  data-value={cargo.id}
                  className={cargoData.type === cargo.id ? 'selected' : ''}
                  onClick={() => handleCargoTypeSelect(cargo.id)}
                >
                  <span className="rb"></span>
                  <span>
                    {cargo.name}
                    {cargo.description && <small>{cargo.description}</small>}
                  </span>
                </button>
              ))}
            </div>

            <div className={`field ${!isWeightValid && cargoData.weight ? 'invalid' : ''}`} id="fieldWeight">
              <div className="label">Примерный вес или объём</div>
              <input
                id="weight"
                value={cargoData.weight}
                onChange={handleWeightChange}
                placeholder="например: 500 кг или 2 паллеты"
              />
              <div className="errorText">Заполните поле.</div>
            </div>

            <div style={{marginTop: '14px'}} className="info">
              <span className="badge">Важно</span>
              <div>Габариты и дополнительные условия не обязательны – их уточнит менеджер при необходимости.</div>
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

export default CargoComponent;
