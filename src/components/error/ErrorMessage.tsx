import { ErrorMessageProps } from '../../types';

const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div className="card" style={{textAlign: 'center', border: '1px solid var(--danger)'}}>
      <div style={{fontSize: '24px', marginBottom: '8px'}}>⚠️</div>
      <div style={{color: 'var(--danger)', fontWeight: 500, marginBottom: '12px'}}>
        {message}
      </div>
      {onRetry && (
        <div className="mainButton" onClick={onRetry} style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}>
          Повторить
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
