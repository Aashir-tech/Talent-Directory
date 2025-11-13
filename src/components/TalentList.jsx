import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTalents } from '../redux/thunks/talentsThunks';
import TalentCard from './TalentCard';

const TalentList = () => {
  const dispatch = useDispatch();
  const { filteredTalents, loading, error, currentFilter } = useSelector(
    (state) => state.talents
  );

  useEffect(() => {
    dispatch(fetchTalents());
  }, [dispatch]);

  if (loading && filteredTalents.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <svg
            className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className="text-gray-600 text-lg">Loading talents...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-red-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-red-700 text-lg font-semibold mb-2">Error Loading Talents</p>
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => dispatch(fetchTalents())}
          className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (filteredTalents.length === 0) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-gray-400 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {currentFilter ? 'No Talents Found' : 'No Talents Yet'}
        </h3>
        <p className="text-gray-600">
          {currentFilter
            ? `No talents found with skill "${currentFilter}". Try a different search.`
            : 'Start by adding your first talent using the form above.'}
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {currentFilter ? (
            <>
              Talents with <span className="text-blue-600">"{currentFilter}"</span>
            </>
          ) : (
            'All Talents'
          )}
        </h2>
        <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full font-semibold">
          {filteredTalents.length} {filteredTalents.length === 1 ? 'Talent' : 'Talents'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTalents.map((talent) => (
          <TalentCard key={talent._id} talent={talent} />
        ))}
      </div>
    </div>
  );
};

export default TalentList;