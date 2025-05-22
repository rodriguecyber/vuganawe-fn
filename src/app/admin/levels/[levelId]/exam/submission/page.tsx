'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

const ExamSubmissions: React.FC = () => {
  const { levelId } = useParams(); 
  const [exams, setExams] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [marks, setMarks] = useState<any>({}); // To store the marks for each submission

  useEffect(() => {
    if (levelId) {
      axios.get(`http://localhost:5000/api/exams/level/${levelId}`,{
        headers:{
          "Authorization":`Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((response) => setExams(response.data))
        .catch((error) => console.error('Error fetching exams', error));

      axios.get(`http://localhost:5000/api/exams/submissions/${levelId}`,{
        headers:{
          "Authorization":`Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((response) => setSubmissions(response.data))
        .catch((error) => console.error('Error fetching submissions', error));
    }
  }, [levelId]);

  const handleAutoMark = (submissionId: string, answers: any) => {
    const exam = exams[0];
    const correctAnswers = exam.questions.reduce((acc: any, question: any) => {
      acc[question._id] = question.correctAnswer;
      return acc;
    }, {});

    let totalMarks = 0;

    for (const questionId in answers) {
      if (answers[questionId] === correctAnswers[questionId]) {
        totalMarks += 1; // Add 1 mark for correct answers
      }
    }

    setMarks((prevMarks: any) => ({
      ...prevMarks,
      [submissionId]: totalMarks
    }));
  };

  // Handle submit marking after all submissions are corrected
  const handleSubmitMarking = () => {
    // Assuming the API expects an object with submissionId and marks
    const markingData = Object.keys(marks).map((submissionId) => ({
      submissionId,
      marks: marks[submissionId]
    }));

    // Submit the marking data to the server
    axios.post(`http://localhost:5000/api/submissions/marking`, markingData,{
      headers:{
        "Authorization":`Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(() => alert('Marking submitted successfully!'))
      .catch((error) => console.error('Error submitting marking', error));
  };

  return (
    <div>
      <div className="m mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl mb-4">Exam Submissions</h2>
        <h3 className="text-xl mb-4">Submissions for level</h3>
        {submissions.length === 0 ? (
          <p>No submissions found for this level.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Student Name</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Submission Date</th>
                <th className="border px-4 py-2">Actions</th>
                <th className="border px-4 py-2">Marks</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((submission) => (
                <tr key={submission._id}>
                  <td className="border px-4 py-2">{submission.studentId.full_name}</td>
                  <td className="border px-4 py-2">{submission.studentId.email}</td>
                  <td className="border px-4 py-2">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                      onClick={() => handleAutoMark(submission._id, submission.answers)}
                    >
                      Auto-Mark
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    {marks[submission._id] !== undefined ? marks[submission._id] : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Submit the marking */}
        {submissions.length > 0 && (
          <div className="mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleSubmitMarking}
            >
              Submit Marking
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamSubmissions;
