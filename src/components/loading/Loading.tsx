import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const LoadingScreen = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);

  useEffect(() => {
    // Auto transition to main screen after delay (like in demo)
    const timer = setTimeout(() => {
      navigate('/main');
    }, 900);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleGoToDemo = () => {
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

  return (
    <div className="app-container">
      <div className="screen">
        <div className="tgbar">
          <div className="backBtn" title="Назад">‹</div>
          <div className="tgtitle">Mini App</div>
          <div className="tgright">
            <div className="chipBtn" onClick={toggleTheme}>Тема</div>
          </div>
        </div>

        <div className="center">
          <div className="bigicon" style={{fontWeight: 900}}>FE</div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '6px'}}>
            <div style={{fontSize: '18px', fontWeight: 900, letterSpacing: '-.2px'}}>Fortuna Express</div>
            <div style={{fontSize: '13px', color: 'var(--muted)'}}>Загружаем сервис оформления перевозки…</div>
          </div>
          <div className="spinner" aria-hidden="true"></div>
        </div>

        <div className="mainButtonWrap">
          <div className="mainButton" onClick={handleGoToDemo}>Перейти к демо</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
