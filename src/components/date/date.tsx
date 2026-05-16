import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Calendar from '../calendar/Calendar';
import { fmtDateFromObject } from '../../utils/date';
import { toggleTheme } from '../../utils/theme';
import { DateData } from '../../types';

const DateComponent = () => {
  const [dateData, setDateData] = useState<DateData>({
    mode: 'asap',
    value: null
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [userStatus, setUserStatus] = useState('new');
  const navigate = useNavigate();

  useEffect(() => {
    // Load saved data from localStorage
    const savedMode = localStorage.getItem('dateMode') as 'asap' | 'pick' | null;
    const savedDate = localStorage.getItem('selectedDate');
    const savedUserStatus = localStorage.getItem('userStatus');
    
    if (savedMode) {
      setDateData(prev => ({ ...prev, mode: savedMode }));
    }
    if (savedDate) {
      const date = new Date(savedDate);
      if (!isNaN(date.getTime())) {
        setDateData(prev => ({ ...prev, value: date }));
      }
    }
    if (savedUserStatus) {
      setUserStatus(savedUserStatus);
    }

  }, []);


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
    if (userStatus === 'existing') {
      navigate('/final');
    }
    else {
      navigate('/phone');
    }
  };

  const handleBackButton = () => {
    navigate('/cargo');
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
                value={dateData.value ? fmtDateFromObject(dateData.value) : ''}
                onClick={handleOpenCalendar}
              />
            </div>

            <div style={{marginTop: '14px'}} className="info">
              <span className="badge">Подсказка</span>
              <div>Даже если дата неизвестна, заявку можно отправить – менеджер уточнит детали.</div>
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
