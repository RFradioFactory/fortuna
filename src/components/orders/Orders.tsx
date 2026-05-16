import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import ErrorMessage from '../error/ErrorMessage';
import { fmtDate } from '../../utils/date';
import { toggleTheme } from '../../utils/theme';
import { Order, City, CargoType, SortOption } from '../../types';

const OrdersScreen = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [cities, setCities] = useState<Record<string, string>>({});
  const [cargoTypes, setCargoTypes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('createdAt');

  const loadOrders = useCallback(async () => {
    try {
      // TODO: Backend request for user orders
      // const response = await apiService.getUserOrders();

      // Current implementation: load from local JSON file
      const response = await fetch('./orders.json');
      const data = await response.json();
      setOrders(data.items || []);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setError('Не удалось загрузить заявки');
      setOrders([]);
    }
  }, []);

  const loadCities = useCallback(async () => {
    try {
      // TODO: Backend request for cities
      // const response = await apiService.getCities();

      // Current implementation: load from local JSON file
      const response = await fetch('./cities.json');
      const citiesData = await response.json();
      const citiesMap: Record<string, string> = {};
      citiesData.items?.forEach((city: City) => {
        citiesMap[city.id] = city.name;
      });
      setCities(citiesMap);
    } catch (error) {
      console.error('Failed to load cities:', error);
      setError('Не удалось загрузить список городов');
    }
  }, []);

  const loadCargoTypes = useCallback(async () => {
    try {
      // TODO: Backend request for cargo types
      // const response = await apiService.getCargoTypes();

      // Current implementation: load from local JSON file
      const response = await fetch('./cargo-types.json');
      const cargoData = await response.json();
      const cargoMap: Record<string, string> = {};
      cargoData.items?.forEach((type: CargoType) => {
        cargoMap[type.id] = type.name;
      });
      setCargoTypes(cargoMap);
    } catch (error) {
      console.error('Failed to load cargo types:', error);
      setError('Не удалось загрузить типы груза');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
    loadCities();
    loadCargoTypes();
  }, [loadOrders, loadCities, loadCargoTypes]);

  const handleBack = () => {
    navigate('/home');
  };



  const getSortedOrders = (): Order[] => {
    const sorted = [...orders];
    
    if (sortBy === 'createdAt') {
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    if (sortBy === 'shipmentDate') {
      return sorted.sort((a, b) => {
        // ASAP orders go first (most urgent)
        if (a.dateMode === 'asap' && b.dateMode !== 'asap') return -1;
        if (b.dateMode === 'asap' && a.dateMode !== 'asap') return 1;
        if (a.dateMode === 'asap' && b.dateMode === 'asap') return 0;
        
        // Both have selected dates - compare them
        const dateA = a.selectedDate ? new Date(a.selectedDate).getTime() : 0;
        const dateB = b.selectedDate ? new Date(b.selectedDate).getTime() : 0;
        return dateA - dateB;
      });
    }
    
    return sorted;
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="screen">
          <div className="center">
            <div className="spinner" aria-hidden="true"></div>
            <div>Загрузка заявок...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="screen">
        <div className="tgbar">
          <div className="backBtn" onClick={handleBack} title="Назад">‹</div>
          <div className="tgtitle">Мои заявки ({orders.length})</div>
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
                setLoading(true);
                loadOrders();
                loadCities();
                loadCargoTypes();
              }}
            />
          )}
          
          {orders.length > 0 && (
            <div className="card" style={{display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center'}}>
              <span style={{fontSize: '13px', color: 'var(--muted)'}}>Сортировка:</span>
              <button
                className={`chipBtn ${sortBy === 'createdAt' ? 'selected' : ''}`}
                onClick={() => setSortBy('createdAt')}
                style={{opacity: sortBy === 'createdAt' ? 1 : 0.6}}
              >
                По дате создания
              </button>
              <button
                className={`chipBtn ${sortBy === 'shipmentDate' ? 'selected' : ''}`}
                onClick={() => setSortBy('shipmentDate')}
                style={{opacity: sortBy === 'shipmentDate' ? 1 : 0.6}}
              >
                По дате отправки
              </button>
            </div>
          )}
          
          {orders.length === 0 ? (
            <div className="card" style={{textAlign: 'center'}}>
              <div style={{color: 'var(--muted)'}}>У вас пока нет заявок</div>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {getSortedOrders().map((order) => (
                <div key={order.id} className="card">
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                    <span className="badge">{order.status}</span>
                    <span style={{fontSize: '13px', color: 'var(--muted)'}}>№{order.id} • {fmtDate(order.createdAt)}</span>
                  </div>
                  
                  <div style={{fontWeight: 600, fontSize: '16px', marginBottom: '6px'}}>
                    {cities[order.cityFrom] || order.cityFrom} → {cities[order.cityTo] || order.cityTo}
                  </div>
                  
                  <div style={{fontSize: '14px', color: 'var(--muted)', marginBottom: '4px'}}>
                    {cargoTypes[order.cargoType] || order.cargoType} • {order.cargoWeight}
                  </div>
                  
                  <div style={{fontSize: '13px', color: 'var(--muted)'}}>
                    {order.dateMode === 'asap' 
                      ? 'Отправка: как можно скорее' 
                      : `Отправка: ${order.selectedDate ? fmtDate(order.selectedDate) : '—'}`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersScreen;
