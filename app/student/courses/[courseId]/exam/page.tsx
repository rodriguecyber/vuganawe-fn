'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

const ExamPage: React.FC = () => {
    const { courseId } = useParams(); // Get courseId from the URL
    const [exam, setExam] = useState<any | null>(null);
    const [studentAnswers, setStudentAnswers] = useState<any>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
    const [isStarted, setIsStarted] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [canStartExam, setCanStartExam] = useState<boolean>(true); // Default to true
    const [hasSubmitted, setHasSubmitted] = useState<boolean>(false); // To track if the student has submitted
    const [submissionData, setSubmissionData] = useState<any | null>(null); // To store submission details
    const countdown = useRef<NodeJS.Timeout | null>(null); // Using useRef to store the countdown

    useEffect(() => {
        const fetchExamData = async () => {
            try {
                // Fetch exam details
                const response = await axios.get(`http://localhost:5000/api/exams/course/${courseId}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const foundExam = response.data;
                setExam(foundExam);

                if (foundExam) {
                    const currentTime = new Date();
                    const examEndTime = new Date(foundExam.endDate);

                    // Check if current time is past the end time
                    if (currentTime > examEndTime) {
                        setCanStartExam(false);
                        setIsTimeUp(true);
                    } else {
                        // Calculate remaining time
                        const remainingTime = examEndTime.getTime() - currentTime.getTime();
                        setTimeLeft(Math.floor(remainingTime));
                        setCanStartExam(true);
                    }
                }

                // Check if the student has already submitted the exam
                const submissionResponse = await axios.get(`http://localhost:5000/api/exams/submission/${foundExam._id}`, {
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem('token')}`
                    }
                });
                if (submissionResponse.data) {
                    setHasSubmitted(true);
                    setSubmissionData(submissionResponse.data);
                } else {
                    setHasSubmitted(false);
                }
            } catch (error) {
                console.error('Error fetching exam data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchExamData();
    }, [courseId]);

    useEffect(() => {
        if (isStarted && timeLeft > 0) {
            countdown.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1000) {
                        if (countdown.current) clearInterval(countdown.current);
                        setIsTimeUp(true);
                        return 0;
                    }
                    return prev - 1000;
                });
            }, 1000);
        }

        return () => {
            if (countdown.current) {
                clearInterval(countdown.current);
            }
        };
    }, [isStarted]);

    const handleAnswerChange = (questionId: string, option: string) => {
        setStudentAnswers((prev: any) => ({
            ...prev,
            [questionId]: option,
        }));
    };

    const handleStartExam = () => {
        setIsStarted(true);

        const examEndTime = new Date(exam.endDate).getTime();
        const currentTime = new Date().getTime();
        const durationInMs = exam.duration * 60000;

        const remainingTime = Math.min(examEndTime - currentTime, durationInMs);

        if (remainingTime <= 0) {
            setIsTimeUp(true);
            setTimeLeft(0);
        } else {
            setTimeLeft(remainingTime);
            setIsTimeUp(false);
        }
    };

    const handleSubmit = async () => {
        try {
            await axios.post(`http://localhost:5000/api/exams/submit/${exam._id}`, {
                answers: studentAnswers,
                courseId
            }, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            });

            alert('Exam submitted successfully!');
            setHasSubmitted(true); 
        } catch (error) {
            console.error('Error submitting exam:', error);
            alert('Error submitting the exam!');
        }
    };

    const formatTime = (timeInMs: number): string => {
        const minutes = Math.floor(timeInMs / 60000);
        const seconds = Math.floor((timeInMs % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (loading) {
        return <div>Loading exam data...</div>;
    }

    if (!exam) {
        return <div>Exam not found</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl mb-4">{exam.title}</h2>

            {/* Reminder */}
            <div className="mb-6 text-lg font-semibold">
                <p className="text-blue-600">Instructions:</p>
                <ul className="list-disc ml-6">
                    <li>Once you click "Start Exam", the timer will begin counting down.</li>
                    <li>Your exam time is limited to {exam.duration} minutes.</li>
                    <li>Make sure you're ready before starting the exam.</li>
                </ul>
            </div>

            {hasSubmitted ? (
                <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                    <p>You have already submitted your exam. Here are your submission details:</p>
                    <div className="mt-2">
                        <p><strong>Submitted At:</strong> {new Date(submissionData.submittedAt).toLocaleString()}</p>
                        <div className="mt-4">
                            <h3 className="font-semibold">Your Answers:</h3>
                            {Object.keys(submissionData.answers).map((questionId) => (
                                <div key={questionId} className="mt-2">
                                    <strong>Question:</strong> {exam.questions.find((q: any) => q._id === questionId)?.question}
                                    <p><strong>Your Answer:</strong> {submissionData.answers[questionId]}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="text-xl font-bold text-red-500 mb-6">
                        {isTimeUp
                            ? 'Time is up!'
                            : isStarted
                                ? `Time Left: ${formatTime(timeLeft)}`
                                : 'Click Start to Begin the Exam'}
                    </div>

                    {exam.questions && exam.questions.length > 0 ? (
                        <form>
                            {exam.questions.map((question: any, index: number) => (
                                <div key={index} className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
                                    <h3 className="font-semibold">{index + 1}. {question.question}</h3>
                                    <div className="mt-2">
                                        {question.options.map((option: string, optIndex: number) => (
                                            <div key={optIndex} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    id={`q${index}_opt${optIndex}`}
                                                    name={`q${index}`}
                                                    value={option}
                                                    checked={studentAnswers[question._id] === option}
                                                    onChange={() => handleAnswerChange(question._id, option)}
                                                    disabled={isTimeUp || !isStarted}
                                                />
                                                <label htmlFor={`q${index}_opt${optIndex}`} className="ml-2">{option}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </form>
                    ) : (
                        <div>No questions found for this exam.</div>
                    )}

                    {/* Start Exam Button */}
                    {!isStarted && canStartExam && (
                        <button
                            type="button"
                            className="w-full bg-green-500 text-white py-2 rounded mt-6"
                            onClick={handleStartExam}
                        >
                            Start Exam
                        </button>
                    )}

                    {/* Submit Button */}
                    {isStarted && !isTimeUp && (
                        <button
                            type="button"
                            className="w-full bg-blue-500 text-white py-2 rounded mt-6"
                            onClick={handleSubmit}
                        >
                            Submit Exam
                        </button>
                    )}

                    {/* Show message when time is up */}
                    {isTimeUp && (
                        <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            <p>Time's up! Your exam has been automatically submitted.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ExamPage;
