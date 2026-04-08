import { useEffect } from "react";
import { useInitData, useMiniApp } from "@tma.js/sdk-react";
import { useNavigate } from "react-router";

import "./App.css";

function App() {
  const initData = useInitData();
  const miniApp = useMiniApp();
  const navigate = useNavigate();

  useEffect(() => {
    miniApp.ready();
    
    // Apply saved theme on app start
    const savedTheme = localStorage.getItem('theme_mode') || 'auto';
    if (savedTheme === 'auto') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
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
