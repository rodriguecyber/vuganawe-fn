'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

const ExamDetails: React.FC = () => {
  const { courseId } = useParams(); // Get courseId from the URL
  const [exam, setExam] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the exam details for the specific course
    const fetchExamDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/exams/course/${courseId}`);
        setExam(response.data); // Set the fetched exam details to state
      } catch (err) {
        setError('Error fetching exam details');
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [courseId]); // Re-fetch if courseId changes

  if (loading) {
    return <div>Loading exam details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!exam) {
    return <div>No exam found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className='flex justify-between items-center'>
        <h2 className="text-2xl mb-4">Exam: {exam.title}</h2>
        <a href={`exam/submission`} className='
        p-2 bg-blue-500 rounded-sm text-white'>submissions</a>
      </div>

      {/* Display start and end date */}
      <p><strong>Start Date:</strong> {new Date(exam.startDate).toLocaleString()}</p>
      <p><strong>End Date:</strong> {new Date(exam.endDate).toLocaleString()}</p>
      <p><strong>Duration:</strong> {exam.duration} minutes</p>

      {/* Display questions */}
      <h3 className="mt-6 text-xl font-semibold">Questions</h3>
      {exam.questions && exam.questions.length > 0 ? (
        <ul className="mt-4">
          {exam.questions.map((question: any, index: number) => (
            <li key={index} className="mb-4 p-4 bg-gray-100 rounded-lg shadow">
              <h4 className="font-semibold">{index + 1}. {question.question}</h4>

              {/* Display options for the question */}
              <ul className="mt-2">
                {question.options.map((option: string, optionIndex: number) => (
                  <li key={optionIndex} className="ml-4">
                    {option}
                    {option === question.correctAnswer && (
                      <span className="text-green-500 ml-2">(Correct)</span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>No questions found for this exam.</p>
      )}
    </div>
  );
};

export default ExamDetails;
