import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useInitData } from '@tma.js/sdk-react';
import { toggleTheme } from '../../utils/theme';

const LoadingScreen = () => {
  const navigate = useNavigate();
  const initData = useInitData();
  const [error, setError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        if (!initData) {
          throw new Error('No init data available');
        }

        localStorage.setItem('initData', JSON.stringify(initData));

        // Преобразуем initData в строку для отправки на бекенд
        const initDataString = JSON.stringify(initData);
        
        // Отправляем запрос на бекенд для проверки статуса пользователя
        // const response = await apiService.initUser(initDataString);
        const response = (await fetch('./initUser.json'));
        const data = await response.json();

        // Сохраняем профиль пользователя, если получили от бекенда
        if (data.userStatus.status) {
          localStorage.setItem('userStatus', JSON.stringify(data.userStatus));
        }
        if (data.userStatus.userData?.userProfile) {
          localStorage.setItem('userProfile', JSON.stringify(data.userStatus.userData.userProfile));
        }
        else localStorage.setItem('userProfile', '');

        // В зависимости от статуса перенаправляем на нужную страницу
        if (data.userStatus.status === 'new') {
          navigate('/main');
        } else if (data.userStatus.status === 'existing') {
          navigate('/home');
        }
      } catch (error) {
        console.error('Error checking user status:', error);
        setError('Не удалось загрузить данные');
        
        // В случае ошибки можно перейти на главную страницу для демо
        setTimeout(() => {
          //navigate('/home');
          navigate('/main');
        }, 2000);
      } finally {
        setIsChecking(false);
      }
    };

    checkUserStatus();
  }, [initData, navigate]);

  const handleGoToMain = () => {
    navigate('/main');
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
            <div style={{fontSize: '13px', color: 'var(--muted)'}}>
              {error ? error : 'Загрузка приложения…'}
            </div>
          </div>
          <div className="spinner" aria-hidden="true"></div>
        </div>

        <div className="mainButtonWrap">
          <div className="mainButton" onClick={handleGoToMain}>Перейти к оформлению</div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
