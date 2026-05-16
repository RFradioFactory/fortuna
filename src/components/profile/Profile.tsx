import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { apiService } from '../../services/api';
import ErrorMessage from '../error/ErrorMessage';
import { toggleTheme } from '../../utils/theme';
import { UserProfile } from '../../types';

// Helper to safely get profile from localStorage
const getSavedProfile = (): Partial<UserProfile> | null => {
  try {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

// Helper to get fallback name from initData
const getFallbackName = (): { lastName: string; firstName: string } => {
  try {
    const initData = localStorage.getItem('initData');
    if (!initData) return {'lastName':'', 'firstName':''};
    const parsed = JSON.parse(initData);
    return {
      'lastName':parsed?.initData?.user?.lastName || '',
      'firstName':parsed?.initData?.user?.firstName || ''};
  } catch {
    return {'lastName':'', 'firstName':''};
  }
};


const ProfileScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isNewProfile, setIsNewProfile] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    firstName: '',
    lastName: '',
    middleName: '',
    email: ''
  });


  useEffect(() => {
    const savedProfile = getSavedProfile();

    if (savedProfile) {
      // Profile exists - use saved data
      setProfile({
        firstName: savedProfile.firstName || '',
        lastName: savedProfile.lastName || '',
        middleName: savedProfile.middleName || '',
        email: savedProfile.email || ''
      });
      setIsNewProfile(false);
    } else {
      // No profile data - use fallback name and enter edit mode for new users
      const fallbackName = getFallbackName();
      setProfile({
        firstName: fallbackName.firstName,
        lastName: fallbackName.lastName,
        middleName: '',
        email: ''
      });
      setIsNewProfile(true);
      setIsEditing(true);
    }

    setLoading(false);
  }, []);

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setError(null);
      localStorage.setItem('userProfile', JSON.stringify(profile));
      //await apiService.updateUserData(profile);
      setIsEditing(false);
      setIsNewProfile(false);
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Не удалось сохранить профиль');
    }
  };

  const handleBack = () => {
    navigate('/home');
  };


  if (loading) {
    return (
      <div className="app-container">
        <div className="screen">
          <div className="center">
            <div className="spinner" aria-hidden="true"></div>
            <div>Загрузка профиля...</div>
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
          <div className="tgtitle">Профиль</div>
          <div className="tgright">
            <div className="chipBtn" onClick={toggleTheme}>Тема</div>
          </div>
        </div>

        <div className="body">
          {error && <ErrorMessage message={error} onRetry={() => setError(null)} />}

          <div className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h1 style={{margin: 0, fontSize: '18px'}}>
                {isEditing
                  ? (isNewProfile ? 'Создание профиля' : 'Редактирование профиля')
                  : 'Данные профиля'}
              </h1>
              {!isNewProfile && (
                <div
                  className="chipBtn"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  style={{cursor: 'pointer'}}
                >
                  {isEditing ? 'Сохранить' : 'Редактировать'}
                </div>
              )}
            </div>

            {isNewProfile && (
              <div style={{marginBottom: '16px', padding: '12px', background: 'var(--bg)', borderRadius: '8px'}}>
                <span style={{color: 'var(--muted)'}}>
                  Профиль не заполнен. Пожалуйста, заполните данные ниже.
                </span>
              </div>
            )}

            {isEditing ? (
              <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                <div className="field">
                  <div className="label">Имя</div>
                  <input
                    value={profile.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    placeholder="Введите имя"
                  />
                </div>
                <div className="field">
                  <div className="label">Фамилия</div>
                  <input
                    value={profile.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    placeholder="Введите фамилию"
                  />
                </div>
                <div className="field">
                  <div className="label">Отчество (при наличии)</div>
                  <input
                    value={profile.middleName}
                    onChange={(e) => handleProfileChange('middleName', e.target.value)}
                    placeholder="Введите отчество"
                  />
                </div>
                <div className="field">
                  <div className="label">Email</div>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    placeholder="email@example.com"
                  />
                </div>
                <div style={{display: 'flex', gap: '8px'}}>
                  {!isNewProfile && (
                    <div
                      className="chipBtn"
                      onClick={() => setIsEditing(false)}
                      style={{opacity: 0.7}}
                    >
                      Отмена
                    </div>
                  )}
                  <div
                    className="chipBtn"
                    onClick={handleSave}
                  >
                    {isNewProfile ? 'Сохранить профиль' : 'Сохранить'}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                <div>
                  <span style={{color: 'var(--muted)', fontSize: '13px'}}>Имя:</span>
                  <div style={{fontSize: '16px'}}>
                    {profile.firstName || <span style={{color: 'var(--muted)', fontStyle: 'italic'}}>Не указано</span>}
                  </div>
                </div>
                <div>
                  <span style={{color: 'var(--muted)', fontSize: '13px'}}>Фамилия:</span>
                  <div style={{fontSize: '16px'}}>
                    {profile.lastName || <span style={{color: 'var(--muted)', fontStyle: 'italic'}}>Не указана</span>}
                  </div>
                </div>
                <div>
                  <span style={{color: 'var(--muted)', fontSize: '13px'}}>Отчество:</span>
                  <div style={{fontSize: '16px'}}>
                    {profile.middleName || <span style={{color: 'var(--muted)', fontStyle: 'italic'}}>Не указано</span>}
                  </div>
                </div>
                <div>
                  <span style={{color: 'var(--muted)', fontSize: '13px'}}>Email:</span>
                  <div style={{fontSize: '16px'}}>
                    {profile.email || <span style={{color: 'var(--muted)', fontStyle: 'italic'}}>Не указан</span>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
