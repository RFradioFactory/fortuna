import {useNavigate} from "react-router";
import {BackButton, BottomBar, MainButton, SecondaryButton} from "@twa-dev/sdk/react";
import {useMiniApp} from "@tma.js/sdk-react";
import {useEffect, useState} from "react";
import InputMask from 'react-input-mask';


const PhoneComponent = () => {
    const miniApp = useMiniApp();
    const localStorage = window.localStorage;
    const [phone, setPhone] = useState(localStorage.getItem('phone') || '');

    useEffect(() => {
        miniApp.ready();
    }, [miniApp]);

    const navigate = useNavigate();
    const handleBackButton = () => {
        navigate('/date')
    }
    const handleSubmit = () => {
        navigate('/final')
    }
    const handlePhone = () => {
        miniApp.requestContact()
            .then(result => {
                setPhone(result.contact.phoneNumber);
                localStorage.setItem('phone', result.contact.phoneNumber);
            });
    }
    const handlePhoneChange = (value: string) => {
        setPhone(value);
        localStorage.setItem('phone', value);
    }
    const disabledMain: boolean = !(phone.replace(/\D/g, '').length === 11);


    return (
        <>
        <h1>Phone</h1>
            <BackButton onClick={() => handleBackButton()} />
            <BottomBar>
                <MainButton text="Продолжить" onClick={() => handleSubmit()} disabled={disabledMain} />
                <SecondaryButton text="Поделиться номером" onClick={() => handlePhone()} />
            </BottomBar>

            <InputMask
                mask="9 999 999-99-99"
                value={phone}
                placeholder="+7 999 123-45-67"
                onChange={(e) => handlePhoneChange(e.target.value)}
            >
                {(inputProps: any) => <input {...inputProps} type="tel" />}
            </InputMask>

        </>
    )
}

export default PhoneComponent
