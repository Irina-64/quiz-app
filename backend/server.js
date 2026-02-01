const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quiz-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const testSchema = new mongoose.Schema({
  questions: [{
    text: String,
    answers: [{
      text: String,
      isCorrect: Boolean
    }]
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Test = mongoose.model('Test', testSchema);

// Получить тест
app.get('/api/test', async (req, res) => {
  try {
    let test = await Test.findOne();
    if (!test) {
      // Создаем тест по умолчанию если не существует
      test = new Test({
        questions: [{
          text: 'Какой язык программирования вы изучаете?',
          answers: [
            { text: 'JavaScript', isCorrect: true },
            { text: 'Python', isCorrect: false },
            { text: 'Java', isCorrect: false },
            { text: 'C++', isCorrect: false }
          ]
        }]
      });
      await test.save();
    }
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Обновить тест
app.put('/api/test', async (req, res) => {
  try {
    const { questions } = req.body;
    
    if (!questions || questions.length === 0) {
      return res.status(400).json({ message: 'Тест должен содержать хотя бы один вопрос' });
    }
    
    let test = await Test.findOne();
    if (!test) {
      test = new Test({ questions });
    } else {
      test.questions = questions;
      test.updatedAt = Date.now();
    }
    
    await test.save();
    res.json(test);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
