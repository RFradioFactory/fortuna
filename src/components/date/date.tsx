import {BackButton, MainButton} from "@twa-dev/sdk/react";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";
import {Switch} from "antd";
import {useMiniApp} from "@tma.js/sdk-react";



const DateComponent = () => {

    const localStorage = window.localStorage;
    const navigate = useNavigate();

    const [date, setDate] = useState(localStorage.getItem('date') || '');
    const [dateDisabled, setDateDisabled] = useState(localStorage.getItem('flagQuickly') === 'true');
    //services
    const getTodayDate = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const minDate =  getTodayDate();

    const handleBackButton = () => {
        navigate('/cargo');
    }
    const handleSubmit = () => {
        navigate('/phone');
    }
    const handleDateChange = (date) => {
        setDate(date);
        localStorage.setItem('date', date.toString());
    }
    const handleSwitchChange = (checked: boolean) => {
        setDateDisabled(checked);
        setDate('');
        localStorage.setItem('date', '');
        localStorage.setItem('flagQuickly', checked.toString());
    }

    const disabledMain: boolean = !date && !dateDisabled;

    return (
        <>
        <h1>Date</h1>
        <BackButton onClick={() => handleBackButton()} />
        <MainButton text="Продолжить" onClick={() => handleSubmit()} disabled={disabledMain} />
        <div>
            <label htmlFor="date">Дата</label>
            <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)}
                min={minDate}
                disabled={dateDisabled}

            />
        </div>
            <label htmlFor="dateDisabled">Как можно скорее</label>
            <Switch value={dateDisabled} onChange={handleSwitchChange} />
        </>
    )
}

export default DateComponent
