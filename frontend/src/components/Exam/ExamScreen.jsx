import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Typography } from "@material-tailwind/react";
import axios from 'axios';
import config from '../../config';

const ExamScreen = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await axios.get(`${config.baseURL}/exam/exams`);
        setExams(response.data);
      } catch (error) {
        console.error('Error fetching exams:', error);
      }
    };

    fetchExams();
  }, []);

  const handleStartExam = (examId) => {
    navigate(`/test/${examId}`);
  };

  return (
    <div className="w-[90%] m-auto flex flex-col items-center py-6">
      <Typography variant="h4" color="blue-gray" className="mb-6">
        Available Exams
      </Typography>
      <div className="flex flex-wrap justify-center gap-6">
        {exams.map((exam) => (
          <Card key={exam._id} className="p-4 w-full max-w-xs">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              {exam.title}
            </Typography>
            <Typography color="gray" className="mb-4">
              {exam.isDecrypted ? "Decrypted" : "Encrypted"}
            </Typography>
            <Button
              onClick={() => handleStartExam(exam._id)}
              className="w-full"
              disabled={!exam.isDecrypted}
            >
              Start Exam
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ExamScreen;
