import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const GuidelinesPage = () => {
  const navigate = useNavigate();
  const { examId } = useParams();

  const handleStartExam = () => {
    navigate(`/exam/${examId}`);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Exam Guidelines</h1>
      <p className="mb-4">Please read the following instructions carefully before starting the exam:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>Make sure you have a stable internet connection.</li>
        <li>Do not refresh the page during the exam.</li>
        <li>Ensure your webcam and microphone are working (if required).</li>
        <li>Attempt all questions within the allotted time.</li>
      </ul>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleStartExam}
      >
        Start Exam
      </button>
    </div>
  );
};

export default GuidelinesPage;
