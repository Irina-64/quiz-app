import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { getTest, updateTest } from '../services/api';

const EditTestPage = () => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const history = useHistory();
  
  useEffect(() => {
    loadTest();
  }, []);
  
  const loadTest = async () => {
    try {
      const testData = await getTest();
      setTest(testData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading test:', error);
      setLoading(false);
    }
  };
  
  const addQuestion = () => {
    const newTest = { ...test };
    newTest.questions.push({
      text: 'Новый вопрос',
      answers: [
        { text: 'Ответ 1', isCorrect: true },
        { text: 'Ответ 2', isCorrect: false }
      ]
    });
    setTest(newTest);
  };
  
  const removeQuestion = (index) => {
    if (test.questions.length <= 1) {
      setMessage({ type: 'error', text: 'Тест должен содержать хотя бы один вопрос' });
      return;
    }
    
    const newTest = { ...test };
    newTest.questions.splice(index, 1);
    setTest(newTest);
  };
  
  const addAnswer = (questionIndex) => {
    const newTest = { ...test };
    newTest.questions[questionIndex].answers.push({
      text: 'Новый ответ',
      isCorrect: false
    });
    setTest(newTest);
  };
  
  const removeAnswer = (questionIndex, answerIndex) => {
    const newTest = { ...test };
    const question = newTest.questions[questionIndex];
    
    if (question.answers.length <= 2) {
      setMessage({ type: 'error', text: 'Вопрос должен содержать хотя бы два варианта ответа' });
      return;
    }
    
    // Проверяем, что остается хотя бы один правильный ответ
    const correctAnswers = question.answers.filter((answer, idx) => 
      answer.isCorrect && idx !== answerIndex
    );
    
    if (correctAnswers.length === 0) {
      setMessage({ type: 'error', text: 'Вопрос должен содержать хотя бы один правильный ответ' });
      return;
    }
    
    question.answers.splice(answerIndex, 1);
    setTest(newTest);
  };
  
  const updateQuestionText = (questionIndex, text) => {
    const newTest = { ...test };
    newTest.questions[questionIndex].text = text;
    setTest(newTest);
  };
  
  const updateAnswerText = (questionIndex, answerIndex, text) => {
    const newTest = { ...test };
    newTest.questions[questionIndex].answers[answerIndex].text = text;
    setTest(newTest);
  };
  
  const toggleAnswerCorrect = (questionIndex, answerIndex) => {
    const newTest = { ...test };
    newTest.questions[questionIndex].answers[answerIndex].isCorrect = 
      !newTest.questions[questionIndex].answers[answerIndex].isCorrect;
    setTest(newTest);
  };
  
  const saveTest = async () => {
    if (!test || !test.questions || test.questions.length === 0) {
      setMessage({ type: 'error', text: 'Тест должен содержать хотя бы один вопрос' });
      return;
    }
    
    // Проверяем все вопросы
    for (let i = 0; i < test.questions.length; i++) {
      const question = test.questions[i];
      
      if (!question.text.trim()) {
        setMessage({ type: 'error', text: `Вопрос ${i + 1}: текст вопроса не может быть пустым` });
        return;
      }
      
      if (!question.answers || question.answers.length < 2) {
        setMessage({ type: 'error', text: `Вопрос ${i + 1}: должно быть минимум два варианта ответа` });
        return;
      }
      
      // Проверяем все ответы в вопросе
      for (let j = 0; j < question.answers.length; j++) {
        if (!question.answers[j].text.trim()) {
          setMessage({ type: 'error', text: `Вопрос ${i + 1}, ответ ${j + 1}: текст ответа не может быть пустым` });
          return;
        }
      }
      
      // Проверяем, есть ли хотя бы один правильный ответ
      const hasCorrectAnswer = question.answers.some(answer => answer.isCorrect);
      if (!hasCorrectAnswer) {
        setMessage({ type: 'error', text: `Вопрос ${i + 1}: должен быть хотя бы один правильный ответ` });
        return;
      }
    }
    
    setSaving(true);
    setMessage(null);
    
    try {
      await updateTest(test);
      setMessage({ type: 'success', text: 'Тест успешно сохранен!' });
      
      // Автоматически скрываем сообщение об успехе через 3 секунды
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Ошибка при сохранении теста: ' + error.message });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Загрузка теста...</p>
      </div>
    );
  }
  
  return (
    <div className="edit-page">
      <div className="edit-header">
        <h2>Редактирование теста</h2>
        <p>Вы можете добавлять, удалять и изменять вопросы теста</p>
      </div>
      
      {message && (
        <div className={`message ${message.type}`}>
          {message.text}
          <button className="message-close" onClick={() => setMessage(null)}>×</button>
        </div>
      )}
      
      <div className="questions-list">
        {test.questions.map((question, questionIndex) => (
          <div key={questionIndex} className="question-editor">
            <div className="question-header">
              <h3>Вопрос {questionIndex + 1}</h3>
              <button 
                className="btn btn-danger btn-sm"
                onClick={() => removeQuestion(questionIndex)}
                disabled={test.questions.length <= 1}
              >
                Удалить вопрос
              </button>
            </div>
            
            <div className="question-input">
              <textarea
                value={question.text}
                onChange={(e) => updateQuestionText(questionIndex, e.target.value)}
                placeholder="Введите текст вопроса"
                rows="3"
              />
            </div>
            
            <div className="answers-editor">
              <h4>Варианты ответов:</h4>
              
              {question.answers.map((answer, answerIndex) => (
                <div key={answerIndex} className="answer-editor">
                  <div className="answer-controls">
                    <button
                      className={`correct-toggle ${answer.isCorrect ? 'correct' : 'incorrect'}`}
                      onClick={() => toggleAnswerCorrect(questionIndex, answerIndex)}
                      title={answer.isCorrect ? 'Правильный ответ' : 'Неправильный ответ'}
                    >
                      {answer.isCorrect ? '✓' : '○'}
                    </button>
                    
                    <input
                      type="text"
                      value={answer.text}
                      onChange={(e) => updateAnswerText(questionIndex, answerIndex, e.target.value)}
                      placeholder="Текст ответа"
                      className="answer-input"
                    />
                    
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeAnswer(questionIndex, answerIndex)}
                      disabled={question.answers.length <= 2}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
              
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => addAnswer(questionIndex)}
              >
                + Добавить вариант ответа
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="edit-actions">
        <button className="btn btn-secondary" onClick={addQuestion}>
          + Добавить вопрос
        </button>
        
        <div className="action-buttons">
          <Link to="/">
            <button className="btn btn-outline">Назад</button>
          </Link>
          
          <button 
            className="btn btn-primary" 
            onClick={saveTest}
            disabled={saving}
          >
            {saving ? 'Сохранение...' : 'Сохранить тест'}
          </button>
        </div>
      </div>
      
      <div className="edit-info">
        <p><strong>Инструкция:</strong></p>
        <ul>
          <li>Нажмите на кнопку с кружком, чтобы отметить правильный ответ (✓)</li>
          <li>Каждый вопрос должен иметь хотя бы один правильный ответ</li>
          <li>Каждый вопрос должен содержать минимум 2 варианта ответа</li>
          <li>Тест должен содержать хотя бы один вопрос</li>
        </ul>
      </div>
    </div>
  );
};

export default EditTestPage;
