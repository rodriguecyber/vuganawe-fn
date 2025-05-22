'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { API_URL } from '@/lib/api/levels';

const ExamDetails: React.FC = () => {
  const { levelId } = useParams(); // Get levelId from the URL
  const [exam, setExam] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the exam details for the specific level
    const fetchExamDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/exams/level/${levelId}`);
        setExam(response.data); // Set the fetched exam details to state
      } catch (err) {
        setError('Error fetching exam details');
      } finally {
        setLoading(false);
      }
    };

    fetchExamDetails();
  }, [levelId]); // Re-fetch if levelId changes

  if (loading) {
    return <div>Loading exam details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!exam) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md text-center">
        <h2 className="text-2xl mb-4 text-orange-500">No Exam Found</h2>
        <p className="mb-6 text-gray-600">There is no exam created for this level yet.</p>
        <a
          href={`/admin/levels/${levelId}/exam/new`}
          className="p-2 bg-orange-500 rounded-sm text-white hover:bg-orange-600"
        >
          Create New Exam
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className='flex justify-between items-center'>
        <h2 className="text-2xl mb-4 text-orange-500">Exam: {exam.title}</h2>
        <a href={`exam/submission`} className='p-2 bg-sky-400 rounded-sm text-white hover:bg-sky-500'>submissions</a>
      </div>

      {/* Display start and end date */}
      <p><strong>Start Date:</strong> {new Date(exam.startDate).toLocaleString()}</p>
      <p><strong>End Date:</strong> {new Date(exam.endDate).toLocaleString()}</p>
      <p><strong>Duration:</strong> {exam.duration} minutes</p>

      {/* Display questions */}
      <h3 className="mt-6 text-xl font-semibold text-orange-500">Questions</h3>
      {exam.questions && exam.questions.length > 0 ? (
        <ul className="mt-4">
          {exam.questions.map((question: any, index: number) => (
            <li key={index} className="mb-4 p-4 bg-sky-50 rounded-lg shadow">
              <h4 className="font-semibold">{index + 1}. {question.question}</h4>

              {/* Display options for the question */}
              <ul className="mt-2">
                {question.options.map((option: string, optionIndex: number) => (
                  <li key={optionIndex} className="ml-4">
                    {option}
                    {option === question.correctAnswer && (
                      <span className="text-orange-500 ml-2">(Correct)</span>
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
