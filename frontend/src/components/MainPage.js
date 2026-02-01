import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HistoryList from './HistoryList';
import { getTest } from '../services/api';

const MainPage = () => {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    // Загружаем историю из localStorage
    const savedHistory = localStorage.getItem('quizHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);
  
  const clearHistory = () => {
    localStorage.removeItem('quizHistory');
    setHistory([]);
  };
  
  return (
    <div className="main-page">
      <header className="header">
        <h1>Quiz Application</h1>
        <p>Тестирование знаний в удобном формате</p>
      </header>
      
      <div className="actions">
        <Link to="/test">
          <button className="btn btn-primary">Запустить тест</button>
        </Link>
        <Link to="/edit">
          <button className="btn btn-secondary">Редактировать тест</button>
        </Link>
      </div>
      
      <div className="history-section">
        <div className="section-header">
          <h2>История прохождений</h2>
          {history.length > 0 && (
            <button className="btn btn-clear" onClick={clearHistory}>Очистить историю</button>
          )}
        </div>
        
        {history.length === 0 ? (
          <div className="empty-history">
            <p>У вас еще нет пройденных тестов</p>
          </div>
        ) : (
          <HistoryList history={history} />
        )}
      </div>
    </div>
  );
};

export default MainPage;
