import { useNavigate } from 'react-router';
import { toggleTheme } from '../../utils/theme';

const MainScreen = () => {
  const navigate = useNavigate();

  const handleStartApplication = () => {
    navigate('/route');
  };


  return (
    <div className="app-container">
      <div className="screen">
        <div className="tgbar">
          <div className="backBtn" onClick={() => window.history.back()} title="Назад">‹</div>
          <div className="tgtitle">Fortuna Express</div>
          <div className="tgright">
            <div className="chipBtn" onClick={toggleTheme}>Тема</div>
          </div>
        </div>

        <div className="body">
          <div className="card">
            <h1>Оформление перевозки</h1>
            <p>Заполните заявку за 1 минуту – 3 коротких шага, без регистрации.</p>
            <div className="info">
              <span className="badge">Важно</span>
              <div>
                Персональные данные и документы передаются напрямую из CRM в Mini App по защищённому каналу.  
                В уведомлениях Telegram персональных данных нет.
              </div>
            </div>
          </div>

          <div className="card">
            <div className="sectionTitle">Как это работает</div>
            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
              <span className="badge">Маршрут</span>
              <span className="badge">Груз</span>
              <span className="badge">Дата</span>
              <span className="badge">Готово</span>
            </div>
          </div>
        </div>

        <div className="mainButtonWrap">
          <div className="mainButton" onClick={handleStartApplication}>Оформить заявку</div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
