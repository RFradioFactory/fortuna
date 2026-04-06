import {useEffect, useState} from "react";


const FinalComponent = () => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const localStorage = window.localStorage;
    const phone = localStorage.getItem('phone');
    const date = localStorage.getItem('date');
    const flag = localStorage.getItem('flagQuickly');
    const cargoType = localStorage.getItem('cargoType');
    const cityFrom = localStorage.getItem('cityFrom');
    const cityTo = localStorage.getItem('cityTo');

    const formData = {
        phone,
        date,
        cargoType,
        cityFrom,
        cityTo
    }
    useEffect(() => {
        //post
        fetch('https://',{
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                setStatus('success');
                localStorage.clear();
            } else {
                setStatus('error');
            }
        })
        .catch(() => {
            setStatus('error');
        });
    }, []);


    return (
        <>
            <h1>Final</h1>
            {status === 'loading' && <p>Идет отправка данных...</p>}
            {status === 'success' && <p>Успешно</p>}
            {status === 'error' &&
                <>
                    <p>Ошибка</p>
            <p>Ваш номер: {phone}</p>
            <p>Дата: {date}</p>
            <p>Срочно: {flag}</p>
            <p>Тип груза: {cargoType}</p>
            <p>Откуда: {cityFrom}</p>
            <p>Куда: {cityTo}</p>
                </>
            }
        </>
    )
}

export default FinalComponent
