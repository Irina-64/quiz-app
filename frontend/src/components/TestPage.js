import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getTest } from '../services/api';

const TestPage = () => {
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isTestCompleted, setIsTestCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  
  useEffect(() => {
    loadTest();
  }, []);
  
  const loadTest = async () => {
    try {
      const testData = await getTest();
      setTest(testData);
      setSelectedAnswers(new Array(testData.questions.length).fill(null));
      setLoading(false);
    } catch (error) {
      console.error('Error loading test:', error);
      setLoading(false);
    }
  };
  
  const handleAnswerSelect = (answerIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishTest();
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const finishTest = () => {
    let correctCount = 0;
    
    test.questions.forEach((question, index) => {
      const selectedAnswerIndex = selectedAnswers[index];
      if (selectedAnswerIndex !== null && question.answers[selectedAnswerIndex].isCorrect) {
        correctCount++;
      }
    });
    
    setScore(correctCount);
    setIsTestCompleted(true);
    
    // Сохраняем результат в историю
    const testResult = {
      date: new Date().toLocaleString('ru-RU'),
      totalQuestions: test.questions.length,
      correctAnswers: correctCount,
      timestamp: new Date().getTime()
    };
    
    const savedHistory = localStorage.getItem('quizHistory');
    let historyData = savedHistory ? JSON.parse(savedHistory) : [];
    historyData.unshift(testResult);
    
    // Сохраняем только последние 50 результатов
    if (historyData.length > 50) {
      historyData = historyData.slice(0, 50);
    }
    
    localStorage.setItem('quizHistory', JSON.stringify(historyData));
  };
  
  const restartTest = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers(new Array(test.questions.length).fill(null));
    setIsTestCompleted(false);
    setScore(0);
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка теста...</p>
      </div>
    );
  }
  
  if (!test || test.questions.length === 0) {
    return (
      <div className="test-page">
        <div className="error-message">
          <h2>Тест не найден</h2>
          <p>Пожалуйста, создайте вопросы в редакторе теста</p>
          <Link to="/edit">
            <button className="btn btn-primary">Перейти к редактору</button>
          </Link>
          <Link to="/">
            <button className="btn btn-secondary">На главную</button>
          </Link>
        </div>
      </div>
    );
  }
  
  if (isTestCompleted) {
    return (
      <div className="test-page">
        <div className="test-completed">
          <h2>Тест завершен!</h2>
          <div className="result-card">
            <div className="result-score">
              <span className="score-number">{score}</span>
              <span className="score-separator">из</span>
              <span className="score-total">{test.questions.length}</span>
            </div>
            <p className="result-text">
              Вы правильно ответили на {score} из {test.questions.length} вопросов
            </p>
            <div className="result-percentage">
              <div className="percentage-bar">
                <div 
                  className="percentage-fill" 
                  style={{ width: `${(score / test.questions.length) * 100}%` }}
                ></div>
              </div>
              <span className="percentage-text">
                {Math.round((score / test.questions.length) * 100)}%
              </span>
            </div>
          </div>
          
          <div className="result-actions">
            <Link to="/">
              <button className="btn btn-primary">На главную</button>
            </Link>
            <button className="btn btn-secondary" onClick={restartTest}>
              Пройти еще раз
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const currentQuestion = test.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === test.questions.length - 1;
  
  return (
    <div className="test-page">
      <div className="test-header">
        <h2>Прохождение теста</h2>
        <div className="progress-indicator">
          <span className="current-question">Вопрос {currentQuestionIndex + 1}</span>
          <span className="total-questions"> из {test.questions.length}</span>
        </div>
      </div>
      
      <div className="question-card">
        <h3 className="question-text">{currentQuestion.text}</h3>
        
        <div className="answers-list">
          {currentQuestion.answers.map((answer, index) => (
            <div 
              key={index}
              className={`answer-item ${selectedAnswers[currentQuestionIndex] === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <div className="answer-radio">
                <div className={`radio-circle ${selectedAnswers[currentQuestionIndex] === index ? 'checked' : ''}`}></div>
              </div>
              <div className="answer-content">
                <span className="answer-text">{answer.text}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="navigation-buttons">
        <button 
          className="btn btn-secondary"
          onClick={handlePrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Предыдущий вопрос
        </button>
        
        <button 
          className="btn btn-primary"
          onClick={handleNextQuestion}
          disabled={selectedAnswers[currentQuestionIndex] === null}
        >
          {isLastQuestion ? 'Завершить тест' : 'Следующий вопрос'}
        </button>
      </div>
      
      <div className="back-to-main">
        <Link to="/">
          <button className="btn btn-outline">На главную</button>
        </Link>
      </div>
    </div>
  );
};

export default TestPage;
