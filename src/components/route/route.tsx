import {BackButton, MainButton} from '@twa-dev/sdk/react';
import {useEffect, useState} from "react";
import { useNavigate } from "react-router";

const RouteComponent = () => {
    const [cities, setCities] = useState([]);
    const localStorage = window.localStorage;

    const [cityFrom, setCityFrom] = useState(localStorage.getItem('cityFrom') || '');
    const [cityTo, setCityTo] = useState(localStorage.getItem('cityTo') || '');

    const navigate = useNavigate();
    useEffect(() => {
        //get cities
        fetch('./cities.json')
            .then(response => response.json())
            .then(data => setCities(data.items))
            .catch(error => console.error(error))

    }, []);

    const handleCityFrom = (city) => {
        setCityFrom(city);
        localStorage.setItem('cityFrom', city)
    }
    const handleCityTo = (city) => {
        setCityTo(city);
        localStorage.setItem('cityTo', city)
    }
    const handleSubmit = () => {
        navigate('/cargo')
    }

    const handleBackButton = () => {
        navigate('/')
    }


    const disableMain: boolean = !cityFrom || !cityTo || cityFrom === cityTo;


    return (
        <>
        <h1>Route</h1>
            <BackButton onClick={() => handleBackButton()} />
            <MainButton text="Продолжить" onClick={() => handleSubmit()} disabled={disableMain} />
            <section style={{display: 'flex', flexDirection: 'column', margin: '10px'}}>
            <label htmlFor="city_from">Город отправления</label>
            <select
                name=""
                id="city_from"
                onChange={(e) => handleCityFrom(e.target.value)}>
                value={cityFrom}
                required
                {cities.map(city => (

                    <option key={city.id} value={city.id} selected = {city.id === cityFrom}>
                        {city.name}
                    </option>
                ))}
                <option value="">-- Выберите город --</option>
            </select>
            </section>
            <section style={{display: 'flex', flexDirection: 'column', margin: '10px'}}>
            <label htmlFor={cityTo}>Город получения</label>
            <select
                name=""
                id="city_to"
                onChange={(e) => handleCityTo(e.target.value)}>
                value={cityTo}
                required
                {cities.map(city => (
                    <option key={city.id} value={city.id} selected = {city.id === cityTo} >
                        {city.name}
                    </option>
                ))}
                <option value="">-- Выберите город --</option>
            </select>
            </section>
            </>
    )
}

export default RouteComponent
