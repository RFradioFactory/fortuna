import { useState, useEffect } from 'react';

interface CalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (date: Date) => void;
  initialDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({ isOpen, onClose, onSelect, initialDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate || null);
  const [tempSelected, setTempSelected] = useState<Date | null>(initialDate || null);

  const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  const DOW = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  useEffect(() => {
    if (initialDate) {
      setCurrentMonth(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
      setSelectedDate(initialDate);
      setTempSelected(initialDate);
    }
  }, [initialDate]);

  const startOfDay = (d: Date) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  };

  const sameDay = (a: Date | null, b: Date | null) => {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  const fmtDate = (d: Date) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yy = d.getFullYear();
    return `${dd}.${mm}.${yy}`;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const clicked = startOfDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
    setTempSelected(clicked);
  };

  const handleApply = () => {
    if (tempSelected) {
      setSelectedDate(tempSelected);
      onSelect(tempSelected);
    }
    onClose();
  };

  const handleClear = () => {
    setTempSelected(null);
    setSelectedDate(null);
    onClose();
  };

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const first = new Date(year, month, 1);
    const last = new Date(year, month + 1, 0);
    
    // Convert JS Sunday=0 to Monday-first index
    const firstDow = (first.getDay() + 6) % 7; // Mon=0..Sun=6
    const totalDays = last.getDate();
    
    const today = startOfDay(new Date());
    const minDate = today; // Disable past dates
    
    const days = [];
    
    // Fill leading blanks
    for (let i = 0; i < firstDow; i++) {
      days.push(<div key={`blank-${i}`} style={{height: '40px'}}></div>);
    }
    
    // Fill days
    for (let day = 1; day <= totalDays; day++) {
      const d = startOfDay(new Date(year, month, day));
      const isPast = d < minDate;
      const isToday = sameDay(d, today);
      const isSelected = sameDay(d, tempSelected);
      
      days.push(
        <div
          key={day}
          className={`day ${isPast ? 'muted' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => !isPast && handleDayClick(day)}
        >
          {String(day)}
        </div>
      );
    }
    
    return days;
  };

  if (!isOpen) return null;

  return (
    <div className="modalOverlay show" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="sheetHead">
          <div className="sheetTitle">Выберите дату</div>
          <button className="sheetClose" onClick={onClose}>Закрыть</button>
        </div>

        <div className="calHead">
          <div className="calNav">
            <button className="calBtn" onClick={handlePrevMonth}>‹</button>
            <button className="calBtn" onClick={handleNextMonth}>›</button>
          </div>
          <div className="calMonth">
            {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </div>
          <span className="badge">сегодня</span>
        </div>

        <div className="calGrid">
          {DOW.map(dow => (
            <div key={dow} className="dow">{dow}</div>
          ))}
          {renderCalendarDays()}
        </div>

        <div className="sheetFooter">
          <button className="btnSmall" onClick={handleClear}>Как можно скорее</button>
          <button className="btnSmall primary" onClick={handleApply}>Выбрать</button>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
