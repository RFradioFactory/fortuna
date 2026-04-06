import { useEffect } from "react";
import { useInitData, useMiniApp } from "@tma.js/sdk-react";

import "./App.css";
import {useNavigate} from "react-router";
import {BottomBar, MainButton, SecondaryButton} from "@twa-dev/sdk/react";

function App() {
  const initData = useInitData();

  const miniApp = useMiniApp();
  const navigate = useNavigate();

  useEffect(() => {
    miniApp.ready();
  }, [miniApp]);

  const handleClickClose = () => {
    miniApp.close()
  }

  const handleClickRoute = () => {
    navigate('/route')
  }

  return (
    <>
      <h1>Telegram Mini App</h1>

        <p>
          Это приложение для быстрого оформления заявок в Fortuna Express.
        </p>
        <p>А вот тебе сразу данные твоего пользователя, без деплоя на сервер:</p>
        <pre>{JSON.stringify(initData?.user, null, 2)}</pre>

      <BottomBar>
        <MainButton text="Оформить заявку на грузоперевозку" onClick={() => handleClickRoute()} />
        <SecondaryButton text="Закрыть" position="bottom" onClick={() => handleClickClose()} />
      </BottomBar>


    </>
  );
}

export default App;
