import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

interface ApplicationData {
  cityFrom: string;
  cityTo: string;
  cargoType: string;
  cargoWeight: string;
  dateMode: string;
  selectedDate: string | null;
  phone: string;
}

const FinalComponent = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Collect all data from localStorage
    const data: ApplicationData = {
      cityFrom: localStorage.getItem('cityFrom') || '—',
      cityTo: localStorage.getItem('cityTo') || '—',
      cargoType: localStorage.getItem('cargoType') || '—',
      cargoWeight: localStorage.getItem('cargoWeight') || '—',
      dateMode: localStorage.getItem('dateMode') || 'asap',
      selectedDate: localStorage.getItem('selectedDate'),
      phone: localStorage.getItem('phone') || '—'
    };

    setApplicationData(data);

    // Simulate API call
    const timer = setTimeout(() => {
      // In real app, this would be an actual API call
      try {
        // For demo purposes, we'll simulate success
        // In production, you would make an actual fetch request here
        console.log('Sending application data:', data);
        
        setStatus('error');
        // Don't clear localStorage immediately in case user wants to see the data
      } catch (error) {
        console.error('Error submitting application:', error);
        setStatus('error');
      }
    }, 1500); // Simulate network delay

    return () => clearTimeout(timer);
  }, []);

  const fmtDate = (dateString: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = date.getFullYear();
    return `${dd}.${mm}.${yy}`;
  };

  const buildSuccessText = () => {
    if (!applicationData) return '...';
    
    const id = String(Math.floor(10000 + Math.random() * 90000));
    const from = applicationData.cityFrom;
    const to = applicationData.cityTo;
    const when = applicationData.dateMode === 'asap' 
      ? 'Как можно скорее' 
      : (applicationData.selectedDate ? fmtDate(applicationData.selectedDate) : '—');
    const cargo = applicationData.cargoType;
    const weight = applicationData.cargoWeight;

    return `Заявка №${id}
Маршрут: ${from} → ${to}
Отправка: ${when}
Груз: ${cargo}
Объём: ${weight}
Статус: Принята`;
  };

  const handleBackToMain = () => {
    // Clear all application data
    localStorage.removeItem('cityFrom');
    localStorage.removeItem('cityTo');
    localStorage.removeItem('cargoType');
    localStorage.removeItem('cargoWeight');
    localStorage.removeItem('dateMode');
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('phone');
    localStorage.removeItem('phoneRequired');
    
    navigate('/main');
  };

  const handleRetry = () => {
    setStatus('loading');
    // Retry the submission
    setTimeout(() => {
      setStatus('success');
    }, 1000);
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

  if (status === 'loading') {
    return (
      <div className="app-container">
        <div className="screen">
          <div className="tgbar">
            <div className="backBtn" onClick={() => navigate('/date')} title="Назад">‹</div>
            <div className="tgtitle">Отправка заявки</div>
            <div className="tgright">
              <div className="chipBtn" onClick={toggleTheme}>Тема</div>
            </div>
          </div>

          <div className="center">
            <div className="bigicon">📤</div>
            <div style={{fontSize: '20px', fontWeight: 900, letterSpacing: '-.2px'}}>Отправляем заявку</div>
            <div style={{color: 'var(--muted)', fontSize: '13.5px', lineHeight: 1.5}}>
              Пожалуйста, подождите...
            </div>
            <div className="spinner" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="app-container">
        <div className="screen">
          <div className="tgbar">
            <div className="backBtn" onClick={() => navigate('/date')} title="Назад">‹</div>
            <div className="tgtitle">Ошибка</div>
            <div className="tgright">
              <div className="chipBtn" onClick={toggleTheme}>Тема</div>
            </div>
          </div>

          <div className="center">
            <div className="bigicon">⚠️</div>
            <div style={{fontSize: '20px', fontWeight: 900, letterSpacing: '-.2px'}}>Что-то пошло не так</div>
            <div style={{color: 'var(--muted)', fontSize: '13.5px', lineHeight: 1.5}}>
              Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.
            </div>
          </div>

          <div className="mainButtonWrap">
            <div className="mainButton" onClick={handleRetry}>Повторить</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="screen">
        <div className="tgbar">
          {/*<div className="backBtn" onClick={() => navigate('/date')} title="Назад">‹</div>*/}
          <div className="tgtitle">Готово</div>
          <div className="tgright">
            <div className="chipBtn" onClick={toggleTheme}>Тема</div>
          </div>
        </div>

        <div className="center">
          <div className="bigicon">✅</div>
          <div style={{fontSize: '20px', fontWeight: 900, letterSpacing: '-.2px'}}>Заявка отправлена</div>
          <div style={{color: 'var(--muted)', fontSize: '13.5px', lineHeight: 1.5}}>
            Менеджер свяжется с вами и уточнит детали при необходимости.
          </div>

          <div className="card" style={{width: '100%', textAlign: 'left'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '8px'}}>
              <span className="badge ok">Принята</span>
              <span className="badge">MVP</span>
            </div>
            <div className="mono">
              {buildSuccessText()}
            </div>
          </div>
        </div>

        <div className="mainButtonWrap">
          <div className="mainButton" onClick={handleBackToMain}>На главную</div>
        </div>
      </div>
    </div>
  );
};

export default FinalComponent;
