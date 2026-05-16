import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { toggleTheme } from '../../utils/theme';
import { Branch } from '../../types';

const BranchesScreen = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const response = await fetch('./branches.json');
        const data = await response.json();
        setBranches(data.items || []);
      } catch (error) {
        console.error('Failed to load branches:', error);
        setError('Не удалось загрузить филиалы');
        setBranches([]);
      } finally {
        setLoading(false);
      }
    };

    loadBranches();
  }, []);

  const handleBack = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="screen">
          <div className="center">
            <div className="spinner" aria-hidden="true"></div>
            <div>Загрузка филиалов...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="screen">
          <div className="tgbar">
            <div className="backBtn" onClick={handleBack} title="Назад">‹</div>
            <div className="tgtitle">Филиалы</div>
            <div className="tgright">
              <div className="chipBtn" onClick={toggleTheme}>Тема</div>
            </div>
          </div>
          <div className="body">
            <div className="card" style={{textAlign: 'center', border: '1px solid var(--danger)'}}>
              <div style={{fontSize: '24px', marginBottom: '8px'}}>⚠️</div>
              <div style={{color: 'var(--danger)', fontWeight: 500, marginBottom: '12px'}}>
                {error}
              </div>
              <div className="mainButton" onClick={() => window.location.reload()} style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
                Обновить
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="screen">
        <div className="tgbar">
          <div className="backBtn" onClick={handleBack} title="Назад">‹</div>
          <div className="tgtitle">Филиалы</div>
          <div className="tgright">
            <div className="chipBtn" onClick={toggleTheme}>Тема</div>
          </div>
        </div>

        <div className="body">
          <div className="card">
            <div className="sectionTitle">Наши филиалы</div>
            <div style={{marginBottom: '16px', color: 'var(--muted)'}}>
              Выберите удобный для вас филиал
            </div>

            {branches.map((branch) => (
              <div key={branch.id} className="card" style={{marginBottom: '12px', background: 'var(--surface2)'}}>
                <div style={{fontWeight: 600, marginBottom: '8px', color: 'var(--text)'}}>
                  {branch.name}
                </div>
                <div style={{marginBottom: '4px', color: 'var(--muted)'}}>
                  📍 {branch.address}
                </div>
                <div style={{marginBottom: '4px', color: 'var(--muted)'}}>
                  📞 {branch.phone}
                </div>
                <div style={{marginBottom: '8px', color: 'var(--muted)'}}>
                  ✉️ {branch.email}
                </div>
                <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                  <div 
                    className="chipBtn" 
                    onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(branch.address)}`, '_blank')}
                    style={{fontSize: '12px'}}
                  >
                    🗺️ Карта
                  </div>
                  <div 
                    className="chipBtn" 
                    onClick={() => window.open(`tel:${branch.phone}`)}
                    style={{fontSize: '12px'}}
                  >
                    📞 Позвонить
                  </div>
                </div>
              </div>
            ))}

            {branches.length === 0 && !error && (
              <div style={{textAlign: 'center', color: 'var(--muted)', padding: '20px'}}>
                Филиалы временно недоступны
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchesScreen;
