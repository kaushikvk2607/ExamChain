import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import config from '../../config';

const TestWindow = () => {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:5000/exam/questions/exam/${examId}`)
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error("Error fetching questions:", error);
      });
  }, [examId]);

  const handleAnswerChange = (questionId, option) => {
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: option
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitExam = () => {
    // Submit the answers to the backend
    axios.post(`${config.baseURL}/exam/submit`, { examId, answers })
      .then(response => {
        console.log("Exam submitted:", response.data);
      })
      .catch(error => {
        console.error("Error submitting exam:", error);
      });
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="p-4">
      {currentQuestion ? (
        <div>
          <h2 className="text-xl mb-4">{currentQuestion.content}</h2>
          <ul className="list-none mb-4">
            {Object.keys(currentQuestion.options).map(optionKey => (
              <li key={optionKey} className="mb-2">
                <label>
                  <input
                    type="radio"
                    name={`question-${currentQuestion._id}`}
                    value={optionKey}
                    checked={answers[currentQuestion._id] === optionKey}
                    onChange={() => handleAnswerChange(currentQuestion._id, optionKey)}
                  />
                  {currentQuestion.options[optionKey]}
                </label>
              </li>
            ))}
          </ul>
          {currentQuestionIndex < questions.length - 1 ? (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleNextQuestion}
            >
              Next Question
            </button>
          ) : (
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleSubmitExam}
            >
              Submit Exam
            </button>
          )}
        </div>
      ) : (
        <p>Loading questions...</p>
      )}
    </div>
  );
};

export default TestWindow;
