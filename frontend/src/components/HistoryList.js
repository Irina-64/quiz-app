import React from 'react';

const HistoryList = ({ history }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU');
  };
  
  return (
    <div className="history-list">
      {history.map((item, index) => (
        <div key={index} className="history-item">
          <div className="history-date">{item.date}</div>
          <div className="history-details">
            <span className="history-stat">Вопросов: {item.totalQuestions}</span>
            <span className="history-stat">Верно: {item.correctAnswers}</span>
          </div>
          <div className="history-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(item.correctAnswers / item.totalQuestions) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {Math.round((item.correctAnswers / item.totalQuestions) * 100)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HistoryList;
