import { useNavigate } from 'react-router';
import { toggleTheme } from '../../utils/theme';
import { DocumentItem, DocumentSection } from '../../types';

const documentSections: DocumentSection[] = [
  {
    title: 'Документы для оформления отправки и получения грузов',
    items: [
      {
        name: 'Заявка на перевозку сборного груза автотранспортом',
        filename: 'Заявка на перевозку сборного груза автотранспортом.xlsx',
        description: 'Для оформления перевозки сборных грузов автомобильным транспортом'
      },
      {
        name: 'Заявка на перевозку сборного груза в вагоне',
        filename: 'Заявка на перевозку сборного груза в вагоне.xlsx',
        description: 'Для оформления перевозки сборных грузов в железнодорожном вагоне'
      },
      {
        name: 'Заявка на контейнерную перевозку',
        filename: 'Заявка на контейнерную перевозку.xlsx',
        description: 'Для оформления контейнерных перевозок'
      },
      {
        name: 'Заявка на перевозку крупногабаритного груза',
        filename: 'Заявка на перевозку крупногабаритного груза.xlsx',
        description: 'Для оформления перевозки негабаритных и тяжеловесных грузов'
      },
      {
        name: 'Заявка на целую машину',
        filename: 'Заявка на целую машину.xlsx',
        description: 'Для бронирования целого автомобиля'
      },
      {
        name: 'Заявка на целый вагон/платформу',
        filename: 'Заявка на целый вагонплатформу.xlsx',
        description: 'Для бронирования целого железнодорожного вагона или платформы'
      },
      {
        name: 'Заявка на услуги ответственного хранения',
        filename: 'Заявка на услуги ответственного хранения.xlsx',
        description: 'Для оформления услуг складского хранения'
      }
    ]
  },
  {
    title: 'Договоры и оферты',
    items: [
      {
        name: 'Договор транспортной экспедиции (Публичная оферта)',
        filename: 'Договор транспортной экспедиции (Публичная оферта).doc',
        description: 'Стандартный договор транспортной экспедиции'
      },
      {
        name: 'Договор транспортной экспедиции НДС 5% (Публичная оферта)',
        filename: 'Договор транспортной экспедиции НДС 5% (Публичная оферта).doc',
        description: 'Договор с пониженной ставкой НДС 5%'
      },
      {
        name: 'Договор ответственного хранения (Публичная оферта)',
        filename: 'Договор ответственного хранения (Публичная оферта).docx',
        description: 'Договор на услуги ответственного хранения груза'
      },
      {
        name: 'Список документов для заключения договора',
        filename: 'Список документов для заключения договора.doc',
        description: 'Перечень необходимых документов для заключения договора'
      }
    ]
  },
  {
    title: 'Реквизиты и учредительные документы',
    items: [
      {
        name: 'Карточка предприятия ООО «Бизнес Джет»',
        filename: 'Карточка предприятия ООО «Бизнес Джет».pdf',
        description: 'Банковские реквизиты компании'
      },
      {
        name: 'Коды статистики ООО «Бизнес Джет»',
        filename: 'Коды статистики ООО «Бизнес Джет».pdf',
        description: 'ОКПО, ОКВЭД и другие статистические коды'
      },
      {
        name: 'Свидетельство о государственной регистрации',
        filename: 'Свидетельство о государственной регистрации ООО «Бизнес Джет».jpg',
        description: 'Свидетельство о регистрации юридического лица'
      },
      {
        name: 'Свидетельство о постановке на налоговый учёт',
        filename: 'Свидетельство о постановке на налоговый учёт ООО «Бизнес Джет».jpg',
        description: 'Присвоение ИНН (свидетельство)'
      },
      {
        name: 'Устав ООО «Бизнес Джет»',
        filename: 'Устав ООО «Бизнес Джет».pdf',
        description: 'Учредительный документ компании'
      },
      {
        name: 'Протокол о создании Общества и назначении Генерального директора',
        filename: 'Протокол о создании Общества и назначении Генерального директора ООО Бизнес Джет.pdf',
        description: 'Решение учредителя о создании компании'
      }
    ]
  },
  {
    title: 'Прочие документы',
    items: [
      {
        name: 'Согласие на обработку персональных данных',
        filename: 'agreement.txt',
        description: 'Форма согласия на обработку ПДн'
      }
    ]
  }
];

const DocumentsScreen = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/home');
  };

  const handleOpenDocument = (filename: string) => {
    window.open(`/docs/${encodeURIComponent(filename)}`, '_blank');
  };


  return (
    <div className="app-container">
      <div className="screen">
        <div className="tgbar">
          <div className="backBtn" onClick={handleBack} title="Назад">‹</div>
          <div className="tgtitle">Документы</div>
          <div className="tgright">
            <div className="chipBtn" onClick={toggleTheme}>Тема</div>
          </div>
        </div>

        <div className="body">
          {documentSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="card" style={{marginBottom: '16px'}}>
              <div className="sectionTitle" style={{fontSize: '16px', marginBottom: '12px'}}>
                {section.title}
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                {section.items.map((doc, docIndex) => (
                  <div
                    key={docIndex}
                    onClick={() => handleOpenDocument(doc.filename)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      padding: '12px',
                      background: 'var(--bg)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    <div style={{fontSize: '14px', fontWeight: 500, marginBottom: '4px'}}>
                      📄 {doc.name}
                    </div>
                    {doc.description && (
                      <div style={{fontSize: '12px', color: 'var(--muted)'}}>
                        {doc.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentsScreen;
