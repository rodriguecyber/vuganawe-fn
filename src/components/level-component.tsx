import React, { useState, useEffect } from "react";

interface Level {
  _id: string;
  title: string;
}

interface LevelPopupProps {
  isOpen: boolean;
  closePopup: () => void;
}

const LevelPopup: React.FC<LevelPopupProps> = ({ isOpen, closePopup }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL 

  // Fetch levels from the backend
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch(`${API_URL}/api/levels/student/all`);
        if (!response.ok) {
          throw new Error("Failed to fetch levels");
        }
        const data: Level[] = await response.json();
        setLevels(data);
        setLoading(false);
      } catch (err) {
        setError("Could not fetch levels");
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchLevels();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLevel) {
      alert("Please select a level.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/enrollement/${selectedLevel}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization":`Bearer ${localStorage.getItem('token')}`
        },
      });

      if (response.ok) {
        alert("level submitted successfully!");
        closePopup();
      } else {
        alert("Failed to submit level.");
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
        <h2 className="text-xl font-semibold mb-4">Select a Level</h2>
        {loading ? (
          <p>Loading levels...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="level" className="block text-sm font-medium mb-2">
                Choose a Level
              </label>
              <select
                id="level"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">Select a level</option>
                {levels.map((level) => (
                  <option key={level._id} value={level._id}>
                    {level.title}
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

export default LevelPopup;
