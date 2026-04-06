import {BackButton, MainButton} from "@twa-dev/sdk/react";
import {useNavigate} from "react-router";
import {useEffect, useState} from "react";





const CargoComponent = () => {

    const localStorage = window.localStorage;
    const navigate = useNavigate();
    const [cargoTypes, setCargoTypes] = useState([]);
    const [cargoType, setCargoType] = useState(localStorage.getItem('cargoType') || '');
    useEffect(() => {
        //get cargo types
        fetch('./cargo-types.json')
            .then(response => response.json())
            .then(data => setCargoTypes(data.items))
            .catch(error => console.error(error))
    }, []);
    const handleBackButton = () => {
        navigate('/route')
    }
    const handleSubmit = () => {
        navigate('/date')
    }

    const handleCargo = (cargo) => {
        setCargoType(cargo)
        localStorage.setItem('cargoType', cargo)
    }

    const disableMain: boolean = !cargoType;

    return (
        <>
        <h1>Cargo</h1>
            <BackButton onClick={() => handleBackButton()} />
            <MainButton text="Продолжить" onClick={() => handleSubmit()} disabled={disableMain} />
            <label htmlFor="cargoType">Тип отправления</label>
            <select
                name=""
                id="cargoType"
                onChange={(e) => handleCargo(e.target.value)}>
                value={cargoType}
                required
                {cargoTypes.map(cargo => (
                    <option key={cargo.id} value={cargo.id} selected={cargo.id === cargoType} >
                        {cargo.name}
                    </option>
                ))}
                <option value="">-- Выберите тип груза --</option>
            </select>
        </>
    )
}


export default CargoComponent
