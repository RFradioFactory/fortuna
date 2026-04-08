import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMiniApp } from '@tma.js/sdk-react';

const PhoneComponent = () => {
  const [phone, setPhone] = useState('');
  const [isValid, setIsValid] = useState(false);
  const miniApp = useMiniApp();
  const navigate = useNavigate();

  useEffect(() => {
    miniApp.ready();
    
    // Load saved phone from localStorage
    const savedPhone = localStorage.getItem('phone');
    if (savedPhone) {
      setPhone(savedPhone);
      setIsValid(validatePhone(savedPhone));
    }
  }, [miniApp]);

  const normalizePhone = (p: string) => {
    return (p || '').replace(/[^\d+]/g, '').trim();
  };

  const validatePhone = (phoneNumber: string) => {
    const p = normalizePhone(phoneNumber);
    const digits = (p.match(/\d/g) || []).length;
    return digits >= 10;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);
    const valid = validatePhone(value);
    setIsValid(valid);
    localStorage.setItem('phone', value);
  };

  const handleRequestContact = () => {
    miniApp.requestContact()
      .then(result => {
        const phoneNumber = result.contact.phoneNumber;
        setPhone(phoneNumber);
        setIsValid(validatePhone(phoneNumber));
        localStorage.setItem('phone', phoneNumber);
      })
      .catch(error => {
        console.error('Error requesting contact:', error);
      });
  };

  const handleSubmit = () => {
    if (isValid) {
      navigate('/final');
    }
  };

  const handleBackButton = () => {
    navigate('/date');
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

  const isButtonDisabled = !isValid;

  return (
    <div className="app-container">
      <div className="screen">
        <div className="tgbar">
          <div className="backBtn" onClick={handleBackButton} title="Назад">‹</div>
          <div className="tgtitle">Контактные данные</div>
          <div className="tgright">
            <div className="chipBtn" onClick={toggleTheme}>Тема</div>
          </div>
        </div>

        <div className="body">
          <div className="card">
            <div className="sectionTitle">Контактный телефон</div>
            <p>Нужен, чтобы менеджер мог связаться с вами по заявке.</p>

            <div className={`field ${!isValid && phone ? 'invalid' : ''}`} id="fieldPhone">
              <div className="label">Телефон</div>
              <input
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="+7 ___ ___-__-__"
                type="tel"
              />
              <div className="errorText">Введите номер телефона.</div>
            </div>

            <div style={{marginTop: '14px'}} className="info">
              <span className="badge">Безопасность</span>
              <div>Телефон передаётся напрямую в CRM по защищённому каналу и не отправляется через сообщения Telegram.</div>
            </div>
          </div>
        </div>

        <div className="mainButtonWrap">
          <div className={`mainButton ${isButtonDisabled ? 'disabled' : ''}`} onClick={handleSubmit}>
            Подтвердить и отправить
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneComponent;
