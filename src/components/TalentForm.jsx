import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTalent } from '../redux/thunks/talentsThunks';
import { clearMessages } from '../redux/slices/talentsSlice';

const TalentForm = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.talents);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    experience: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.skills.trim()) {
      errors.skills = 'At least one skill is required';
    }

    if (!formData.experience) {
      errors.experience = 'Experience is required';
    } else if (formData.experience < 0) {
      errors.experience = 'Experience cannot be negative';
    } else if (formData.experience > 50) {
      errors.experience = 'Experience cannot exceed 50 years';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const skillsArray = formData.skills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill);

    const talentData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      skills: skillsArray,
      experience: Number(formData.experience),
    };

    const result = await dispatch(addTalent(talentData));

    if (addTalent.fulfilled.match(result)) {
      setFormData({
        name: '',
        email: '',
        skills: '',
        experience: '',
      });
      setFormErrors({});
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        dispatch(clearMessages());
      }, 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Talent</h2>

      {successMessage && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              formErrors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="John Doe"
          />
          {formErrors.name && (
            <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              formErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="john@example.com"
          />
          {formErrors.email && (
            <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">
            Skills <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              formErrors.skills ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="React, Node.js, MongoDB (comma separated)"
          />
          {formErrors.skills && (
            <p className="mt-1 text-sm text-red-500">{formErrors.skills}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Enter skills separated by commas
          </p>
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
            Experience (years) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
              formErrors.experience ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="5"
            min="0"
            max="50"
          />
          {formErrors.experience && (
            <p className="mt-1 text-sm text-red-500">{formErrors.experience}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Adding...
            </span>
          ) : (
            'Add Talent'
          )}
        </button>
      </form>
    </div>
  );
};

export default TalentForm;