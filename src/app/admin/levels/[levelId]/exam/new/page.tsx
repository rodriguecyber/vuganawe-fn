'use client';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { API_URL } from '@/lib/api/levels';

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const CreateExam: React.FC = () => {
  const { levelId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [examData, setExamData] = useState({
    title: '',
    startDate: '',
    endDate: '',
    duration: 60,
    questions: [] as Question[]
  });

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });

  const [titleFocused, setTitleFocused] = useState(false);
  const maxTitleLength = 100;

  const validateTitle = (title: string) => {
    if (title.length < 3) {
      return 'Title must be at least 3 characters long';
    }
    if (title.length > maxTitleLength) {
      return 'Title cannot exceed 100 characters';
    }
    return '';
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setExamData(prev => ({ ...prev, title: newTitle }));
    const titleError = validateTitle(newTitle);
    if (titleError) {
      setError(titleError);
    } else {
      setError(null);
    }
  };

  const handleAddQuestion = () => {
    if (!currentQuestion.question || currentQuestion.options.some(opt => !opt) || !currentQuestion.correctAnswer) {
      setError('Please fill in all question fields');
      return;
    }
    setExamData(prev => ({
      ...prev,
      questions: [...prev.questions, currentQuestion]
    }));
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
    setError(null);
  };

  const validateDates = () => {
    const start = new Date(examData.startDate);
    const end = new Date(examData.endDate);
    const now = new Date();

    if (start < now) {
      setError('Start date cannot be in the past');
      return false;
    }
    if (end <= start) {
      setError('End date must be after start date');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (examData.questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    if (!validateDates()) {
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/exams`, {
        ...examData,
        levelId
      });
      router.push(`/admin/levels/${levelId}/exam`);
    } catch (err) {
      setError('Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-orange-500">Create New Exam</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Exam Information */}
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Title
              <span className="text-orange-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={examData.title}
                onChange={handleTitleChange}
                onFocus={() => setTitleFocused(true)}
                onBlur={() => setTitleFocused(false)}
                className={`block p-2 w-full rounded-md shadow-sm pr-24 
                  ${titleFocused ? 'border-orange-500 ring-1 ring-orange-500' : 'border-gray-300'}
                  focus:border-orange-500 focus:ring-orange-500
                  ${error && examData.title.length > 0 ? 'border-red-300' : ''}
                  transition-colors duration-200`}
                placeholder="Enter a descriptive title for the exam"
                required
                maxLength={maxTitleLength}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className={`text-sm ${examData.title.length > maxTitleLength - 20
                  ? 'text-orange-500'
                  : 'text-gray-400'
                  }`}>
                  {examData.title.length}/{maxTitleLength}
                </span>
              </div>
            </div>
            {examData.title.length > 0 && (
              <div className="mt-1">
                {error ? (
                  <p className="text-sm text-red-500">{error}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    {titleFocused ? "Press Enter when you're done" :
                      examData.title.length < 3 ? "Title must be at least 3 characters long" : "✓ Valid title"}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="datetime-local"
                  value={examData.startDate}
                  onChange={(e) => {
                    setExamData(prev => ({ ...prev, startDate: e.target.value }));
                    setError(null);
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  required
                  min={new Date().toISOString().slice(0, 16)}
                />
                {examData.startDate && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    {formatDate(examData.startDate)}
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="datetime-local"
                  value={examData.endDate}
                  onChange={(e) => {
                    setExamData(prev => ({ ...prev, endDate: e.target.value }));
                    setError(null);
                  }}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  required
                  min={examData.startDate || new Date().toISOString().slice(0, 16)}
                />
                {examData.endDate && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    {formatDate(examData.endDate)}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                value={examData.duration}
                onChange={(e) => setExamData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                className="block p-2 w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                min="1"
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question Form */}
        <div className="bg-sky-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-orange-500">Add Question</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Question</label>
              <textarea
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Options</label>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...currentQuestion.options];
                      newOptions[index] = e.target.value;
                      setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
                    }}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    placeholder={`Option ${index + 1}`}
                  />
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={currentQuestion.correctAnswer === option}
                    onChange={() => setCurrentQuestion(prev => ({ ...prev, correctAnswer: option }))}
                    className="h-4 w-4 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-500">Correct</span>
                  {currentQuestion.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => {
                        const newOptions = [...currentQuestion.options];
                        newOptions.splice(index, 1);
                        setCurrentQuestion(prev => ({
                          ...prev,
                          options: newOptions,
                          correctAnswer: prev.correctAnswer === option ? '' : prev.correctAnswer
                        }));
                      }}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  setCurrentQuestion(prev => ({
                    ...prev,
                    options: [...prev.options, '']
                  }));
                }}
                className="mt-2 flex items-center text-sky-500 hover:text-sky-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Option
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddQuestion}
              className="w-full p-2 bg-sky-400 text-white rounded-sm hover:bg-sky-500"
            >
              Add Question
            </button>
          </div>
        </div>

        {/* Added Questions List */}
        {examData.questions.length > 0 && (
          <div className="bg-sky-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-orange-500">Added Questions ({examData.questions.length})</h2>
            <ul className="space-y-2">
              {examData.questions.map((q, index) => (
                <li key={index} className="p-2 bg-white rounded shadow-sm">
                  <p className="font-medium">{q.question}</p>
                  <p className="text-sm text-gray-600">Correct Answer: {q.correctAnswer}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 text-red-500 rounded-md">
            {error}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 bg-gray-200 text-gray-700 rounded-sm hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="p-2 bg-orange-500 text-white rounded-sm hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Exam'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExam;
