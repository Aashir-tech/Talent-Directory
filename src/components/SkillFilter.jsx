import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../redux/slices/talentsSlice';

const SkillFilter = () => {
  const dispatch = useDispatch();
  const { currentFilter, talents } = useSelector((state) => state.talents);
  const [inputValue, setInputValue] = useState(currentFilter);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    dispatch(setFilter(value));
  };

  const handleClear = () => {
    setInputValue('');
    dispatch(setFilter(''));
  };

  // Extract unique skills from all talents
  const allSkills = [...new Set(talents.flatMap((talent) => talent.skills))].sort();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Filter by Skill</h2>
      
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleFilterChange}
          placeholder="Search by skill (e.g., React, Node.js)"
          className="w-full px-4 py-3 pr-24 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition"
          >
            Clear
          </button>
        )}
      </div>

      {allSkills.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Popular skills:</p>
          <div className="flex flex-wrap gap-2">
            {allSkills.slice(0, 10).map((skill) => (
              <button
                key={skill}
                onClick={() => {
                  setInputValue(skill);
                  dispatch(setFilter(skill));
                }}
                className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition"
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillFilter;