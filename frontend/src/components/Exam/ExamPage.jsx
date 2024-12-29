import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Typography } from "@material-tailwind/react";
import axios from 'axios';
import config from '../../config';

const ExamPage = () => {
  const { examId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [timer, setTimer] = useState(3600); // 1 hour in seconds
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/exam/questions?examId=${examId}`);
        setQuestions(response.data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };

    fetchQuestions();
  }, [examId]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(countdown);
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    try {
      const privateKey = localStorage.getItem('privateKey');
      const publicKey = localStorage.getItem('publicKey'); // Ensure the public key is retrieved or generated

      const answers = await Promise.all(
        Object.entries(userAnswers).map(async ([questionId, answer]) => {
          const message = JSON.stringify({ questionId, answer, examId });
          const signature = await signMessage(message, privateKey);

          return {
            message,
            signature,
            publicKey
          };
        })
      );

      await axios.post(`${config.baseURL}/exam/submit`, { answers });

      console.log('Answers submitted successfully');
      navigate('/results'); // Navigate to a results page or confirmation page
    } catch (error) {
      console.error('Error submitting answers:', error);
    }
  };

  const signMessage = async (message, privateKeyBase64) => {
    const privateKeyArrayBuffer = Uint8Array.from(atob(privateKeyBase64), c => c.charCodeAt(0)).buffer;
    const cryptoKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyArrayBuffer,
      { name: 'RSA-PSS', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const signature = await crypto.subtle.sign(
      { name: 'RSA-PSS', saltLength: 32 },
      cryptoKey,
      data
    );

    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  };

  return (
    <div className="w-[90%] m-auto flex flex-col items-center py-6">
      <Typography variant="h4" color="blue-gray" className="mb-6">
        Exam
      </Typography>
      <Typography variant="h6" color="red" className="mb-6">
        Time Remaining: {`${Math.floor(timer / 60)}:${timer % 60}`}
      </Typography>
      <div className="flex flex-wrap justify-center gap-6">
        {questions.map((question) => (
          <Card key={question._id} className="p-4 w-full max-w-xs">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              {question.encrypted ? "Question not available" : question.content}
            </Typography>
            {question.encrypted ? null : (
              <div>
                {Object.entries(question.options).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <label>
                      <input
                        type="radio"
                        name={question._id}
                        value={key}
                        onChange={() => handleAnswerChange(question._id, key)}
                      />
                      {value}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
      <Button onClick={handleSubmit} className="mt-6">
        Submit Exam
      </Button>
    </div>
  );
};

export default ExamPage;
