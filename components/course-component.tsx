import React, { useState, useEffect } from "react";

// Define types for course and form submission
interface Course {
  _id: string;
  title: string;
}

interface CoursePopupProps {
  isOpen: boolean;
  closePopup: () => void;
}

const CoursePopup: React.FC<CoursePopupProps> = ({ isOpen, closePopup }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL 

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`${API_URL}/api/courses/student/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }
        const data: Course[] = await response.json();
        setCourses(data);
        setLoading(false);
      } catch (err) {
        setError("Could not fetch courses");
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCourses();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) {
      alert("Please select a course.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/enrollement/${selectedCourse}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${localStorage.getItem('token')}`
        },
      });

      if (response.ok) {
        alert("Course submitted successfully!");
        closePopup();
      } else {
        alert("Failed to submit course.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Select a Course</h2>
        {loading ? (
          <p>Loading courses...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="course" className="block text-sm font-medium mb-2">
                Choose a Course
              </label>
              <select
                id="course"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">Select a course</option>
                {courses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={closePopup}
                className="px-4 py-2 bg-gray-300 text-black rounded-lg"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CoursePopup;
