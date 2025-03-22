'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
const ExamForm: React.FC = () => {
  const { courseId } = useParams(); // Extract courseId from the URL parameters
  const [examTitle, setExamTitle] = useState('');
  const [questions, setQuestions] = useState([{ question: '', options: ['', '', '', ''], correctAnswer: '' }]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [duration, setDuration] = useState(60);
  const [courses, setCourses] = useState<any[]>([]); // You might not need this anymore
  const [selectedCourse, setSelectedCourse] = useState(courseId || ''); // Use courseId from URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL 

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newExam = {
        title: examTitle,
        courseId: courseId, // Use courseId from URL
        questions,
        startDate,
        endDate,
        duration,
      };
      await axios.post(`${API_URL}/api/exams`, newExam);
      alert('Exam created successfully!');
    } catch (err) {
      alert('Error creating exam');
    }
  };

  // Function to handle adding a new question
  const addQuestion = () => {
    setQuestions([...questions, { question: '', options: [''], correctAnswer: '' }]);
  };

  // Function to handle changes to question text
  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = e.target.value;
    setQuestions(updatedQuestions);
  };

  // Function to handle changes to an option text
  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>, questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  // Function to handle changes to the correct answer
  const handleCorrectAnswerChange = (e: React.ChangeEvent<HTMLSelectElement>, questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctAnswer = e.target.value;
    setQuestions(updatedQuestions);
  };

  // Function to add a new option for a specific question
  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push('');
    setQuestions(updatedQuestions);
  };

  // Function to remove an option for a specific question
  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuestions(updatedQuestions);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl mb-4">Create Exam</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold">Exam Title</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
          />
        </div>

        {/* Removed course selection dropdown, courseId is now fetched from URL */}

        {/* Render questions dynamically */}
        {questions.map((q, questionIndex) => (
          <div key={questionIndex} className="mb-4">
            <label className="block text-sm font-semibold">Question {questionIndex + 1}</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-1"
              placeholder="Enter question"
              value={q.question}
              onChange={(e) => handleQuestionChange(e, questionIndex)}
            />

            {/* Render options dynamically */}
            {q.options.map((opt, optionIndex) => (
              <div key={optionIndex} className="mt-2 flex items-center">
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  placeholder={`Option ${optionIndex + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(e, questionIndex, optionIndex)}
                />
                {q.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(questionIndex, optionIndex)}
                    className="ml-2 text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            <div className="mt-2">
              <button
                type="button"
                onClick={() => addOption(questionIndex)}
                className="text-green-500"
              >
                Add Option
              </button>
            </div>

            {/* Dropdown to select the correct answer */}
            <div className="mt-2">
              <label className="block text-sm font-semibold">Correct Answer</label>
              <select
                className="w-full p-2 border border-gray-300 rounded mt-1"
                value={q.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(e, questionIndex)}
              >
                <option value="">-- Select Correct Answer --</option>
                {q.options.map((option, optionIndex) => (
                  <option key={optionIndex} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}

        <div className="mt-4">
          <button
            type="button"
            className="w-full bg-green-500 text-white py-2 rounded"
            onClick={addQuestion}
          >
            Add Another Question
          </button>
        </div>

        <div className="mb-4 mt-6">
          <label className="block text-sm font-semibold">Start Date</label>
          <input
            type="datetime-local"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold">End Date</label>
          <input
            type="datetime-local"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold">Duration (minutes)</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Create Exam
        </button>
      </form>
    </div>
  );
};

export default ExamForm;
