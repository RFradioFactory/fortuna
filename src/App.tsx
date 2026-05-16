import { useEffect } from "react";
import { useMiniApp } from "@tma.js/sdk-react";
import { useNavigate } from "react-router";

import "./App.css";
import {toggleTheme} from "./utils/theme.ts";

function App() {
  const miniApp = useMiniApp();
  const navigate = useNavigate();

  useEffect(() => {
    miniApp.ready();
    toggleTheme();

    // Redirect to loading screen on initial load
    navigate('/loading');
  }, [miniApp, navigate]);

  return (
    <div className="app-container">
      {/* App content will be rendered by router */}
    </div>
  );
}

export default App;
