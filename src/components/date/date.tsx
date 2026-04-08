import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Calendar from '../calendar/Calendar';

interface DateData {
  mode: 'asap' | 'pick';
  value: Date | null;
}

const DateComponent = () => {
  const [dateData, setDateData] = useState<DateData>({
    mode: 'asap',
    value: null
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [phoneRequired, setPhoneRequired] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Load saved data from localStorage
    const savedMode = localStorage.getItem('dateMode') as 'asap' | 'pick' | null;
    const savedDate = localStorage.getItem('selectedDate');
    const savedPhoneRequired = localStorage.getItem('phoneRequired');
    
    if (savedMode) {
      setDateData(prev => ({ ...prev, mode: savedMode }));
    }
    if (savedDate) {
      const date = new Date(savedDate);
      if (!isNaN(date.getTime())) {
        setDateData(prev => ({ ...prev, value: date }));
      }
    }
    if (savedPhoneRequired !== null) {
      setPhoneRequired(savedPhoneRequired === 'true');
    }
  }, []);

  const fmtDate = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear();
    return `${dd}.${mm}.${yy}`;
  };

  const handleDateModeSelect = (mode: 'asap' | 'pick') => {
    setDateData(prev => ({ ...prev, mode, value: mode === 'asap' ? null : prev.value }));
    localStorage.setItem('dateMode', mode);
    
    if (mode === 'pick') {
      setIsCalendarOpen(true);
    }
  };

  const handleDateSelect = (date: Date) => {
    setDateData(prev => ({ ...prev, mode: 'pick', value: date }));
    localStorage.setItem('selectedDate', date.toISOString());
    localStorage.setItem('dateMode', 'pick');
  };

  const handleOpenCalendar = () => {
    setIsCalendarOpen(true);
  };

  const handleSubmit = () => {
    // Save phone requirement state
    localStorage.setItem('phoneRequired', phoneRequired.toString());
    
    // Navigate based on phone requirement
    if (phoneRequired) {
      navigate('/phone');
    } else {
      navigate('/final');
    }
  };

  const handleBackButton = () => {
    navigate('/cargo');
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

  const togglePhoneRequired = () => {
    const newRequired = !phoneRequired;
    setPhoneRequired(newRequired);
    localStorage.setItem('phoneRequired', newRequired.toString());
  };

  const isFormValid = () => {
    return dateData.mode === 'asap' || (dateData.mode === 'pick' && dateData.value);
  };

  const isButtonDisabled = !isFormValid();

  return (
    <div className="app-container">
      <div className="screen">
        <div className="tgbar">
          <div className="backBtn" onClick={handleBackButton} title="Назад">‹</div>
          <div className="tgtitle">Заявка – шаг 3 из 3</div>
          <div className="tgright">
            <div className="chipBtn" onClick={toggleTheme}>Тема</div>
          </div>
        </div>

        <div className="body">
          <div className="card">
            <div className="sectionTitle">Дата отправки</div>
            <p>Можно выбрать дату или "как можно скорее".</p>

            <div className="radio" id="dateMode">
              <button
                type="button"
                data-value="asap"
                className={dateData.mode === 'asap' ? 'selected' : ''}
                onClick={() => handleDateModeSelect('asap')}
              >
                <span className="rb"></span>
                <span>Как можно скорее</span>
              </button>
              <button
                type="button"
                data-value="pick"
                className={dateData.mode === 'pick' ? 'selected' : ''}
                onClick={() => handleDateModeSelect('pick')}
              >
                <span className="rb"></span>
                <span>Выбрать дату <small>в MVP можно указать ориентировочно</small></span>
              </button>
            </div>

            <div className="field" id="fieldDate" style={{display: dateData.mode === 'pick' ? 'block' : 'none'}}>
              <div className="label">Выбранная дата</div>
              <input
                id="dateValue"
                readOnly
                placeholder="Нажмите, чтобы выбрать дату"
                value={dateData.value ? fmtDate(dateData.value) : ''}
                onClick={handleOpenCalendar}
              />
            </div>

            <div style={{marginTop: '14px'}} className="info">
              <span className="badge">Подсказка</span>
              <div>Даже если дата неизвестна, заявку можно отправить – менеджер уточнит детали.</div>
            </div>

            <div className="card" style={{marginTop: '12px', background: 'var(--surface2)'}}>
              <div className="sectionTitle">Демо ветки "Телефон"</div>
              <p style={{marginBottom: '10px'}}>Для демонстрации можно включить/выключить запрос телефона.</p>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap'}}>
                <span className="badge">Телефон: {phoneRequired ? 'включён' : 'выключен'}</span>
                <div className="chipBtn" onClick={togglePhoneRequired}>Переключить</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mainButtonWrap">
          <div className={`mainButton ${isButtonDisabled ? 'disabled' : ''}`} onClick={handleSubmit}>
            Отправить заявку
          </div>
        </div>
      </div>

      <Calendar
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onSelect={handleDateSelect}
        initialDate={dateData.value || undefined}
      />
    </div>
  );
};

export default DateComponent;
