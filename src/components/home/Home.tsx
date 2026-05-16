import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { apiService } from '../../services/api';
import { toggleTheme } from '../../utils/theme';
import { Order } from '../../types';


const HomeScreen = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const getInitName = () => {
    try {
      const initData = localStorage.getItem('initData');
      if (!initData) return '';
      const parsed = JSON.parse(initData);
      return parsed?.initData?.user?.lastName || '';
    } catch {
      return '';
    }
  };
  const initName = getInitName();

  const getProfileDisplayName = () => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      return parsed.firstName || parsed.lastName || initName || 'Пользователь';
    }
    return initName || 'Пользователь';
  };

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // TODO: Backend request for user orders
        // const response = await apiService.getUserOrders();
        // Current implementation: load from local JSON file
        const response = await fetch('./orders.json');
        const data = await response.json();
        setOrders(data.items || []);
      } catch (error) {
        console.error('Failed to load orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [navigate]);

  const handleNewApplication = () => {
    navigate('/route');
  };

  const handleLogout = () => {
    apiService.clearToken();
    navigate('/loading');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };


  if (loading) {
    return (
      <div className="app-container">
        <div className="screen">
          <div className="center">
            <div className="spinner" aria-hidden="true"></div>
            <div>Загрузка данных...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="screen">
        <div className="tgbar">
          <div className="backBtn" onClick={handleLogout} title="Выход">‹</div>
          <div className="tgtitle">Личный кабинет</div>
          <div className="tgright">
            <div className="chipBtn" onClick={toggleTheme}>Тема</div>
          </div>
        </div>

        <div className="body">
          <div className="card" onClick={handleProfileClick} style={{cursor: 'pointer'}}>
            <div className="sectionTitle">Профиль</div>
            <div style={{textAlign: 'center', color: 'var(--muted)'}}>
              {getProfileDisplayName()}
            </div>
          </div>

          <div className="card" onClick={() => navigate('/orders')} style={{cursor: 'pointer'}}>
            <div className="sectionTitle">Мои заявки</div>
            <div style={{textAlign: 'center', color: 'var(--muted)'}}>
              {orders.length === 0 ? 'У вас пока нет заявок' : `Количество заявок: ${orders.length}`}
            </div>
          </div>

          <div className="card" onClick={() => navigate('/documents')} style={{cursor: 'pointer'}}>
            <div className="sectionTitle">Документы</div>
            <div style={{textAlign: 'center', color: 'var(--muted)'}}>
              Договоры, заявки, реквизиты
            </div>
          </div>

          <div className="card" onClick={() => navigate('/branches')} style={{cursor: 'pointer'}}>
            <div className="sectionTitle">Филиалы</div>
            <div style={{textAlign: 'center', color: 'var(--muted)'}}>
              Адреса и контакты
            </div>
          </div>

          <div className="card">
            <div className="sectionTitle">Действия</div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
              <div className="mainButton" onClick={handleNewApplication}>
                Новая заявка
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
