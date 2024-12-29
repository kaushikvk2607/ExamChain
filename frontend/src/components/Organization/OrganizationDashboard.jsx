import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  List,
  ListItem,
  ListItemSuffix,
  Card,
  IconButton,
  Typography,
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";
import ModalComponent from './ModalComponent';

function TrashIcon() {
  // ... (TrashIcon component remains unchanged)
}

const OrganizationDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [decryptionKey, setDecryptionKey] = useState('');
  const [showDecryptDialog, setShowDecryptDialog] = useState(false);
  const [exams, setExams] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    content: '',
    options: { a: '', b: '', c: '', d: '' },
    answer: '',
    organizationId: '',
    examId: '',
    encryptionKey: '',
  });

  useEffect(() => {
    fetchQuestions();
    fetchExams();
    fetchOrganizations();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/exam/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const fetchExams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/exam/exams');
      setExams(response.data);
    } catch (error) {
      console.error('Error fetching exams:', error);
    }
  };

  const fetchOrganizations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/exam/organizations');
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    }
  };

  const handleDelete = async (questionId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this question?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/exam/questions/${questionId}`);
        fetchQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const handleDecrypt = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/exam/api/v2/question/decrypt',
        {
          questionId: selectedQuestion._id,
          decryptionKey,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token from localStorage
          },
        }
      );
      setSelectedQuestion({
        ...selectedQuestion,
        content: response.data.content,
        options: response.data.options,
        answer: response.data.answer,
        organizationId: response.data.organizationId,
        encrypted: false
      });
      setShowDecryptDialog(false);
    } catch (error) {
      console.error('Error decrypting question:', error);
    }
  };


  const handleCreateQuestion = async () => {
    const confirmCreate = window.confirm('Are you sure you want to create this question?');
    if (confirmCreate) {
      try {
        await axios.post('http://localhost:5000/exam/api/v2/question/create', newQuestion,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token from localStorage
            },
          }
        );
        setShowCreateDialog(false);
        resetNewQuestion();
        fetchQuestions();
      } catch (error) {
        console.error('Error creating question:', error);
      }
    }
  };

  const resetNewQuestion = () => {
    setNewQuestion({
      content: '',
      options: { a: '', b: '', c: '', d: '' },
      answer: '',
      organizationId: '',
      examId: '',
      encryptionKey: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuestion(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOptionChange = (option, value) => {
    setNewQuestion(prev => ({
      ...prev,
      options: {
        ...prev.options,
        [option]: value
      }
    }));
  };

  return (
    <Card className="w-full p-6">
      <ModalComponent/>
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Registered Questions
      </Typography>
      <Button
        variant="text"
        color="blue"
        onClick={() => setShowCreateDialog(true)}
        className="mb-4"
      >
        Add New Question
      </Button>
      <List>
        {questions.map((question) => (
          <ListItem
            key={question._id}
            ripple={false}
            className="py-1 pr-1 pl-4"
            onClick={() => setSelectedQuestion(question)}
          >
            {question.encrypted ? question.content.slice(0, 20) + '...' : question.content}
            <ListItemSuffix>
              <IconButton
                variant="text"
                color="blue-gray"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(question._id);
                }}
              >
                <TrashIcon />
              </IconButton>
            </ListItemSuffix>
          </ListItem>
        ))}
      </List>
      {selectedQuestion && (
        <div className="mt-4 px-10">
          <Typography variant="h6" color="blue-gray">
            Selected Question Details
          </Typography>
          <Typography variant="body1" color="blue-gray">
            {selectedQuestion.content}
          </Typography>
          {Object.entries(selectedQuestion.options).map(([key, value]) => (
            <Typography key={key} variant="body2" color="blue-gray">
              {key}: {value}
            </Typography>
          ))}
          <Typography variant="body2" color="blue-gray">
            Answer: {selectedQuestion.answer}
          </Typography>
          <Typography variant="body2" color="blue-gray">
            Organization ID: {selectedQuestion.organizationId}
          </Typography>
          {selectedQuestion.encrypted && (
            <Button
              variant="text"
              color="blue"
              onClick={() => setShowDecryptDialog(true)}
            >
              Decrypt Question
            </Button>
          )}
          <Button
            variant="text"
            color="red"
            onClick={() => setSelectedQuestion(null)}
          >
            Close
          </Button>
        </div>
      )}

      {/* Decrypt Dialog */}
      <Dialog open={showDecryptDialog} onClose={() => setShowDecryptDialog(false)}>
        <DialogBody>
          <Input
            label="Decryption Key"
            value={decryptionKey}
            onChange={(e) => setDecryptionKey(e.target.value)}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue" onClick={handleDecrypt}>
            Decrypt
          </Button>
          <Button variant="text" color="red" onClick={() => setShowDecryptDialog(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Create Question Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
        <DialogBody className='gap-4 flex-col flex'>
          <Typography variant='h3' color='black'>Enter the question details</Typography>
          <Select
            label="Select Exam"
            value={newQuestion.examId}
            onChange={(value) => handleInputChange({ target: { name: 'examId', value } })}
          >
            {exams.map((exam) => (
              <Option key={exam._id} value={exam._id}>
                {exam.title}
              </Option>
            ))}
          </Select>
          <Select
            label="Select Organization"
            value={newQuestion.organizationId}
            onChange={(value) => handleInputChange({ target: { name: 'organizationId', value } })}
          >
            {organizations.map((org) => (
              <Option key={org._id} value={org._id}>
                {org.name}
              </Option>
            ))}
          </Select>
          <Input
            label="Content"
            name="content"
            value={newQuestion.content}
            onChange={handleInputChange}
          />
          {['a', 'b', 'c', 'd'].map((option) => (
            <Input
              key={option}
              label={`Option ${option.toUpperCase()}`}
              value={newQuestion.options[option]}
              onChange={(e) => handleOptionChange(option, e.target.value)}
            />
          ))}
          <Input
            label="Answer"
            name="answer"
            value={newQuestion.answer}
            onChange={handleInputChange}
          />
          <Input
            label="Encryption Key"
            name="encryptionKey"
            value={newQuestion.encryptionKey}
            onChange={handleInputChange}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue" onClick={handleCreateQuestion}>
            Create
          </Button>
          <Button variant="text" color="red" onClick={() => setShowCreateDialog(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
};

export default OrganizationDashboard;